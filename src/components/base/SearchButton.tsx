import { useRef } from "react";

import { Icon } from "xtreme-ui";

import "./searchButton.scss";

const SearchButton = (props: TSearchButton) => {
	const { placeholder, setSearchActive, value, setValue } = props;
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="search" onClick={() => inputRef?.current?.focus()}>
			<input
				onBlur={() => setSearchActive(false)}
				onChange={(event) => setValue(event.target.value)}
				onFocus={() => setSearchActive(true)}
				placeholder={placeholder}
				ref={inputRef}
				type="text"
				value={value}
			/>
			<Icon className="searchIcon" code="f002" type="solid" />
		</div>
	);
};

export default SearchButton;
export interface TSearchButton {
	placeholder: string;
	setSearchActive: (searchActive: boolean) => void;
	setValue: (searchActive: string) => void;
	value: string;
}
