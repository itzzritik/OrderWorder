import './noContent.scss';

const NoContent = (props: TNoContentProps) => {
	const { icon, label } = props;
	return (
		<div className='noContent'>
			<div>
				<span style={getIconMask(props.icon)} />
				{props.label && <p>{props.label}</p>}
			</div>
		</div>
	);
};

export default NoContent;

export type TNoContentProps = {
	icon: string,
	label: string,
}
