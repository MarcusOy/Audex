import React, { useEffect, useState } from 'react';
import Form from '@rjsf/fluent-ui';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { useQuery } from '@apollo/client';
import { GET_FORM } from '../../Data/Queries';

const AccountSettingsTab = () => {
	const { data, loading, error, refetch } = useQuery(GET_FORM, {
		variables: {
			entityName: 'User',
		},
	});
	const [schema, setSchema] = useState();
	const [uiSchema, setUISchema] = useState();

	console.log(schema);
	console.log(JSON.stringify(schema));
	useEffect(() => {
		if (data) {
			setSchema(JSON.parse(data.formSchema.schema));
			// setUISchema(JSON.parse(data.formSchema.uISchema));
		}
	}, [data]);

	if (loading) return <Spinner size={SpinnerSize.small} />;
	if (error || schema == undefined)
		return <Spinner size={SpinnerSize.small} />;

	return <Form schema={schema} />;
};

export default AccountSettingsTab;
