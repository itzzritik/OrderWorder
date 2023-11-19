import clsx from 'clsx';

import './cartTaxItem.scss';

const CartTaxItem = (props: TCartTaxItemProps) => {
	const { className, name, size = 'default', subtitle, taxPercent, amount, onClick } = props;
	const roundAmount = Math.round(amount * 100) / 100;
	return (
		<div className={clsx('cartTaxItem', className, size)} onClick={onClick}>
			<p className='taxName'>{name + (taxPercent ? ` (${taxPercent}%)` : '')}</p>
			{subtitle && <p className='subtitle'>{subtitle}</p>}
			<p className='taxAmount rupee'>{roundAmount}</p>
		</div>
	);
};

export default CartTaxItem;

export type TCartTaxItemProps = {
	className?: string
	name: string
	subtitle?: string
	size?: 'mini' | 'default'
	taxPercent?: number
	amount: number
	onClick?: () => void
}
