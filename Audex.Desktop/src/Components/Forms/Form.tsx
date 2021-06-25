import { DevTool } from '@hookform/devtools';
import React from 'react';
import { Control, FormProvider, useForm } from 'react-hook-form';

interface IFormProps {
	onFormSubmit: (data: any) => void;
	onFormError: (errors: any, e: any) => void;
	children: React.ReactNode;
}

export interface IFormControlProps {
	name: any;
	defaultValue?: any;
}

const Form = <T,>(p: IFormProps) => {
	const methods = useForm<T>();

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(p.onFormSubmit, p.onFormError)}
			>
				{p.children}
			</form>
			{/* <DevTool control={methods.control} /> */}
		</FormProvider>
	);
};

export default Form;
