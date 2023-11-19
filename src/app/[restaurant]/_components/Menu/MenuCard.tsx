import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';
import { Icon } from 'xtreme-ui';

import QuantityButton from '#components/base/QuantityButton';
import { TMenu } from '#utils/database/models/menu';

import './menuCard.scss';

const vegIcon = {
	'veg': 'f4d8',
	'non-veg': 'f6d6',
	'contains-egg': 'f7fb',
} as const;

const MenuCard = (props: TMenuCardProps) => {
	const { className, show, restrictOrder, showInfo, setShowInfo, item, quantity } = props;
	const [cardRef, inView] = useInView({ threshold: 0 });

	const classList = clsx(
		'menuCard ',
		className,
		restrictOrder && 'restrictOrder',
		showInfo && 'showInfo',
		!item.image && 'withoutImage',
		window.matchMedia('(hover: hover)').matches && 'hoverSupported',
	);

	if (!show) return null;

	return (
		<div className={classList + (!inView ? 'blank' : '')} ref={cardRef}>
			{
				inView
				&& <>
					{
						item.image &&
						<div className='picture'>
							<span style={{ background: `url(${item.image})` }} />
							<div className='description'>{item.description}</div>
						</div>
					}
					{
						item.veg &&
						<div className={`vegIcon ${item.veg}`}>
							<Icon className='icon' type='duotone' size={16} code={vegIcon[item.veg]} />
							<span className='label'>{item.veg.replace(/-/g, ' ')}</span>
						</div>
					}
					<div className='options'>
						<div className='title'>
							<span>{item.name}</span>
							{
								item.image &&
								<div className='info' onClick={() => setShowInfo(showInfo ? false : !!item._id)}>
									<Icon code={showInfo ? 'f00d' : 'f05a'} />
								</div>
							}
						</div>
						{ !item.image && <div className='description'>{item.description}</div> }
						<div className='footer'>
							{!item.image && <div className='priceNoImage rupee'>{item.price}</div>}
							<QuantityButton className='addToCart' quantity={quantity} filled
								increaseQuantity={() => props.increaseQuantity(item)}
								decreaseQuantity={() => props.decreaseQuantity(item)}
							/>
						</div>
					</div>
					{
						item.image &&
						<div className='price rupee'>
							<div className='ribbonTop' />
							<div className='ribbonBottom' />
							<span>{item.price}</span>
						</div>
					}
				</>
			}
		</div>
	);
};

export default MenuCard;

type TMenuCardProps = {
	className?: string,
	show?: boolean,
	restrictOrder?:boolean,
	showInfo?: boolean,
	setShowInfo: (showInfo: boolean) => void,
	item: TMenuCustom,
	quantity: number,
	increaseQuantity: (item: TMenuCustom) => void,
	decreaseQuantity: (item: TMenuCustom) => void,
}

type TMenuCustom = TMenu & {quantity: number}
