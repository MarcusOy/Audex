import { Dropdown, IDropdownProps } from '@fluentui/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IFormControlProps } from './Form';

interface IFormDropdownProps extends IFormControlProps {
	dropdownProps: IDropdownProps;
}

const FormDropdown = (p: IFormDropdownProps) => {
	const { control } = useFormContext();
	return (
		<Controller
			control={control}
			name={p.name}
			defaultValue={p.defaultValue}
			render={({
				field: { onChange, onBlur, value, name, ref },
				fieldState: { invalid, isTouched, isDirty, error },
				formState,
			}) => (
				<Dropdown
					ref={ref}
					onChange={(_, d) => onChange(d!.key)}
					onFocus={() => {
						if (!isTouched) isTouched = true;
					}}
					onBlur={onBlur}
					// value={value}
					selectedKey={value}
					{...p.dropdownProps}
				/>
			)}
		/>
	);
};

export default FormDropdown;
