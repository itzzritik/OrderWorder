import { useRef } from 'react';

import { Icon } from 'xtreme-ui';

import './searchButton.scss';

const SearchButton = (props: TSearchButton) => {
	const { placeholder, setSearchActive, value, setValue } = props;
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className='search' onClick={() => inputRef?.current?.focus()}>
			<input type='text'
				ref={inputRef}
				placeholder={placeholder}
				value={value}
				onChange={(event) => setValue(event.target.value)}
				onFocus={() => setSearchActive(true)}
				onBlur={() => setSearchActive(false)}
			/>
			<Icon className='searchIcon' code='f002' />
		</div>
	);
};

export default SearchButton;
export type TSearchButton = {
	placeholder: string,
	setSearchActive: (searchActive: boolean) => void,
	value: string,
	setValue: (searchActive: string) => void,
}
