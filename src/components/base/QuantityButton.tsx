import clsx from 'clsx';
import { Icon } from 'xtreme-ui';

import './quantityButton.scss';

const QuantityButton = (props: TQuantityButtonProps) => {
	const { className, disabled, filled, quantity, increaseQuantity, decreaseQuantity } = props;

	const classList = clsx('quantityButton',
		className,
		disabled && 'disabled',
		filled && 'filled',
		quantity && 'quantityValue',
	);

	return (
		<div className={classList}>
			<div className='hiddenContainer'>
				{!props.disabled && <div className='quantity decrease' onClick={decreaseQuantity}>
					<Icon code='2d' type='solid' />
				</div>}
				<div className='value'>
					{disabled && <Icon code='f00d' />}
					<p>{quantity || '0'}</p>
				</div>
			</div>
			{!disabled && <div className='quantity increase' onClick={increaseQuantity}>
				{quantity ? <Icon code='2b' type='solid' size={16} /> : 'Add' }
			</div>}
		</div>
	);
};

export default QuantityButton;

type TQuantityButtonProps = {
	className?: string,
	disabled?: boolean,
	filled?: boolean,
	quantity: number
	increaseQuantity: () => void,
	decreaseQuantity: () => void,
}
