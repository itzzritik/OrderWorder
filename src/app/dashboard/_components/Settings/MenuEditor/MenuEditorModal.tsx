import React, { useEffect, useState, useRef } from 'react';

import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

import './menuEditorModal.scss';

const MenuEditorModal = (props) => {
	const { setState: setModalState, editItem, setEditItem } = props;

	const [heading, setHeading] = useState('');
	const [stateList, setStateList] = useState([]);
	const [menuItemSubmit, setMenuItemSubmit] = useState(true);
	const [menuItemSubmitLabel, setMenuItemSubmitLabel] = useState('create');
	const [submitLoading, setSubmitLoading] = useState(false);

	const [displayImage, setDisplayImage] = useState('');
	const [image, setImage] = useState();
	const [uploadedImageURL, setUploadedImageURL] = useState('');
	const [uploadPercent, setUploadPercent] = useState(0);
	const [categoryName, setCategoryName] = useState('');
	const [selectedCategoryList, setSelectedCategoryList] = useState([]);
	const [itemName, setItemName] = useState('');
	const [itemVeg, setItemVeg] = useState('veg');
	const [itemDesc, setItemDesc] = useState('');
	const [itemPrice, setItemPrice] = useState('0');

	const categoryInput = useRef();
	const itemNameInput = useRef();
	const filePicker = useRef();
	const menuEditorModalRef = useRef();
	const menuItemContainer = useRef();

	const maxLengthCategory = 80;
	const maxLengthItemName = 55;
	const maxLengthItemPrice = 16;
	const maxLengthItemDesc = 100;

	const selectStyles = {
		control: (styles) => ({
			...styles,
			minHeight: '50px',
			paddingLeft: '10px',
			borderRadius: 8,
			fontFamily: 'var(--font-family-primary)',
			color: 'var(--color-content-primary)',
			border: '0',
			boxShadow: 'none',
		}),
		menuPortal: (styles) => ({ ...styles, zIndex: 10 }),
		option: (styles) => ({
			...styles,
			fontFamily: 'var(--font-family-primary)',
			color: 'var(--color-content-primary)',
			cursor: 'pointer',
			':hover': {
				backgroundColor: 'rgba(var(--color-brand-primary-rgb), 0.1)',
			},
		}),
	};

	const titleCase = (value) => (value ? value[0]?.toUpperCase() + value?.slice(1) : '');
	const onClearImage = () => {
		setDisplayImage('');
		setUploadedImageURL();
		setImage();
	};
	const clearModalState = () => {
		onClearImage();
		setMenuItemSubmitLabel('create');
		setSubmitLoading(false);
		setUploadPercent(0);
		setCategoryName('');
		setItemName('');
		setItemVeg('veg');
		setItemPrice('0');
		setItemDesc('');
		setSelectedCategoryList([]);
		setModalState();
		setEditItem();
		setStateList([]);
	};
	const onBackdrop = () => {
		if (props.state === 'newState' || props.state === 'menuItemEditState') {
			clearModalState();
		}
	};
	const onMenuItemContainerScroll = () => {
		const target = menuItemContainer?.current;

		if (Math.round(target.scrollHeight - target.scrollTop) > target.clientHeight) {
			setMenuItemSubmit(false);
		} else {
			setMenuItemSubmit(true);
		}
	};
	const categorySubmitOnClick = () => {
		setSubmitLoading(true);
		Meteor.call('insertNewCategory', categoryName, props.restaurantID, (err) => {
			setSubmitLoading(false);

			if (err) {
				console.log(err);
				return toast.error(err.error);
			}

			toast.success('New category added');
			return clearModalState();
		});
	};
	const menuItemSubmitOnClick = () => {
		onMenuItemContainerScroll();

		if (menuItemSubmit) {
			setSubmitLoading(true);

			uploadMenuItemImage(image, uploadedImageURL, setUploadPercent, (err, imageURL) => {
				if (err) {
					setSubmitLoading(false);

					console.log(err);
					return toast.error('Failed to upload image!');
				}
				setUploadedImageURL(imageURL);

				if (props.state === 'menuItemEditState') {
					const menuItem = {};

					itemName !== editItem.name
						&& (menuItem.name = titleCase(itemName));

					selectedCategoryList !== editItem.category
						&& (menuItem.category = selectedCategoryList);

					itemDesc !== editItem.description
						&& (menuItem.description = itemDesc);

					imageURL && (menuItem.image = imageURL);
					!displayImage && editItem.image && (menuItem.image = '');

					parseFloat(itemPrice).toFixed(2).toString() !== editItem.price.toString()
						&& (menuItem.price = parseFloat(itemPrice).toFixed(2).toString());

					itemVeg.replace(/ /g, '-') !== editItem.veg
						&& (menuItem.veg = itemVeg.replace(/ /g, '-'));

					if (isEmpty(menuItem)) {
						toast.warn('Nothing to update');
						return setSubmitLoading(false);
					}

					Meteor.call('updateMenuItem', editItem._id, menuItem, (err) => {
						setSubmitLoading(false);

						if (err) {
							console.log(err);
							return toast.error(err.error);
						}

						toast.success('Menu item updated');
						return clearModalState();
					});
				} else {
					const menuItem = {
						name: titleCase(itemName),
						category: selectedCategoryList,
						description: itemDesc,
						image: imageURL,
						price: parseFloat(itemPrice).toFixed(2).toString(),
						veg: itemVeg.replace(/ /g, '-'),
					};

					Meteor.call('insertMenuItem', menuItem, props.restaurantID, (err) => {
						setSubmitLoading(false);

						if (err) {
							console.log(err);
							return toast.error(err.error);
						}

						toast.success('New menu item added');
						return clearModalState();
					});
				}
			});
		}

		menuItemContainer.current.scrollTop = menuItemContainer.current.scrollHeight;
	};
	const onCategorySelect = (categories, change) => {
		if (change.action === 'clear') {
			return setSelectedCategoryList([]);
		}
		if (change.action === 'remove-value') {
			return setSelectedCategoryList((list) => list.filter((val) => change.removedValue.value !== val));
		}
		if (change.action === 'select-option') {
			return setSelectedCategoryList((list) => [...list, change.option.value]);
		}
	};
	const onPrev = () => {
		if (props.state === 'menuItemEditState') {
			clearModalState();
		}

		setStateList((stateList) => stateList.slice(0, -1));
	};
	const onNext = (state) => {
		setStateList((stateList) => [...stateList, state]);
	};
	const onNewImage = (imageData) => {
		if (imageData) {
			setDisplayImage(URL.createObjectURL(imageData));
			setImage(imageData);
		}
	};

	useEffect(() => {
		if (props.state === 'menuItemEditState' && editItem) {
			setMenuItemSubmitLabel('update');
			setItemName(editItem.name ?? '');
			setItemVeg(editItem.veg.replace(/-/g, ' ') ?? 'veg');
			setItemPrice(editItem.price.toString() ?? '0');
			setItemDesc(editItem.description ?? '');
			setDisplayImage(editItem.image ?? '');
			setSelectedCategoryList(editItem.category ?? []);

			itemNameInput.current.focus();
			onMenuItemContainerScroll();
		}
	}, [editItem, props.state]);

	useEffect(() => {
		setModalState(stateList[stateList.length - 1]);
	}, [stateList, setModalState]);

	useEffect(() => {
		if (props.state === 'newState') {
			onNewImage();
		}
		if (props.state === 'menuCategoryState') {
			setTimeout(() => categoryInput.current.focus(), 250);
		}
		if (props.state === 'menuItemState') {
			setTimeout(() => {
				itemNameInput.current.focus();
				onMenuItemContainerScroll();
			}, 250);
		}
	}, [props.state]);

	useEffect(() => {
		if (!stateList.length && props.state) {
			setStateList((stateList) => [...stateList, props.state]);
		}

		setHeading({
			newState: 'create new',
			menuCategoryState: 'new menu category',
			menuItemState: 'new menu item',
			menuItemEditState: 'edit menu item',
		}[props.state]);
	}, [props.state, stateList.length]);

	return (
		<div className={`menuEditorModal ${props.state ? `show ${props.state}` : ''}`} ref={menuEditorModalRef}>
			<div className='backdrop' onClick={onBackdrop} />
			<div className='modalViewport'>
				<div className='modalHeader'>
					<div>
						<span onClick={onPrev}
							style={getIconMask(`/icons/Base/${stateList.length > 1 ? 'arrowLeft' : 'plus'}.svg`)}
						/>
						<h5 className='heading'>{heading}</h5>
					</div>
					<h5 className='uploadProgress'>{submitLoading ? `${uploadPercent}%` : '' }</h5>
				</div>
				<div className='modalContent'>
					<div className='newSelector'>
						<div className='newMenuCategory' onClick={() => onNext('menuCategoryState')}>Menu Category</div>
						<div className='newMenuItem' onClick={() => onNext('menuItemState')}>Menu Item</div>
					</div>
					<div className='menuCategoryContainer'>
						<MenuCategory title={categoryName || 'Enter category name'} />
						{image && <div className='removeImage' onClick={onClearImage}>
							<span style={getIconMask('/icons/Base/cross.svg')} />
						</div>}
						<div className='categoryControls'>
							<div className='categoryNameTitle'>
								<h6>Category Name</h6>
								<span>{categoryName?.length}/{maxLengthCategory}</span>
							</div>
							<TextInput placeholder='Enter category name' maxLength={maxLengthCategory}
								value={categoryName} setValue={setCategoryName} useRef={categoryInput}
							/>
							<div className='categoryButtons'>
								<Button label={menuItemSubmitLabel} filled round
									onClick={categorySubmitOnClick} loading={submitLoading}
								/>
							</div>
						</div>
					</div>
					<div className='menuItemContainer' ref={menuItemContainer} onScroll={onMenuItemContainerScroll}>
						<div className='menuItemHead'>
							<div className='menuItemImage' onClick={() => filePicker.current.click()}>
								{
									!displayImage
										? <span className='placeholder' style={getIconMask('/icons/Base/cutlery.svg')} />
										: <span className='image' style={{ backgroundImage: `url(${displayImage})` }} />
								}
							</div>
							{
								displayImage
								&& <div className='removeImage' onClick={onClearImage}>
									<span style={getIconMask('/icons/Base/cross.svg')} />
								</div>
							}
							<div className='itemNameContainer'>
								<div className='itemNameTitle'>
									<h5>Item Name</h5>
									<span>{itemName?.length}/{maxLengthItemName}</span>
								</div>
								<TextInput placeholder='Enter item name' maxLength={maxLengthItemName}
									value={itemName} setValue={setItemName} useRef={itemNameInput}
								/>
							</div>
						</div>
						<div className='menuItemBody'>
							<ToggleButton className='vegSelector'
								items={['veg', 'non veg', 'contains egg']}
								active={itemVeg} setActive={setItemVeg}
							/>
							<div className='itemPrice'>
								<div className='itemPriceLabel'>
									<h6>Item Price</h6>
									<span>{itemPrice?.length}/{maxLengthItemPrice}</span>
								</div>
								<TextInput placeholder='Enter item price' maxLength={maxLengthItemPrice}
									icon='/icons/Base/rupee.svg'
									value={itemPrice} setValue={setItemPrice} price
								/>
							</div>
							<div className='itemDescription'>
								<div className='itemDescriptionLabel'>
									<h6>Item Description</h6>
									<span>{itemDesc?.length}/{maxLengthItemDesc}</span>
								</div>
								<textarea placeholder='Enter item description' value={itemDesc}
									onChange={(e) => setItemDesc(e.target.value.slice(0, maxLengthItemDesc))}
								/>
							</div>
							<div className='itemCategory'>
								<h6>Item Category</h6>
								<Select className='categorySelector' styles={selectStyles}
									menuPosition='fixed' menuPortalTarget={menuEditorModalRef.current}
									isSearchable isClearable isMulti
									placeholder='Select item categories' menuPlacement='top'
									closeMenuOnSelect={false}
									value={selectedCategoryList.map((item) => ({ value: item, label: item }))}
									options={props.categoryList.map((item) => ({ value: item, label: item }))}
									onChange={onCategorySelect}
								/>
							</div>
						</div>
					</div>
					<Button className='submitMenuItem' onClick={menuItemSubmitOnClick} filled round
						label={menuItemSubmit ? menuItemSubmitLabel : 'More'} loading={submitLoading}
					/>
				</div>
			</div>
			<FilePicker useRef={filePicker} type='image' minImageSize={100} edit onCrop={onNewImage} />
		</div>
	);
};

export default MenuEditorModal;

export type TMenuEditorModalProps = {

	// state={modalState}
	// setState: () => void
	// editItem={editItem}
	// setEditItem={setEditItem}
}
