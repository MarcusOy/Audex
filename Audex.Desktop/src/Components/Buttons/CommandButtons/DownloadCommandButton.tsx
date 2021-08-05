import { useMutation } from '@apollo/client';
import {
	CommandBarButton,
	ICommandBarItemProps,
	IComponentAs,
	IComponentAsProps,
	Spinner,
	SpinnerSize,
} from '@fluentui/react';
import React from 'react';
import { GET_DOWNLOAD_TOKENS_FOR_STACK } from '../../../Data/Mutations';
import DownloadService from '../../../Data/Services/DownloadService';
import ToastService, { ErrorToast } from '../../../Data/Services/ToastService';
import { IStackRow } from '../../../Pages/Tabs/StacksTab';
import { IFileRow } from '../../Modals/StackPanel';

export interface IDownloadCommandButtonProps
	extends IComponentAsProps<ICommandBarItemProps> {
	selectedStacks?: IStackRow[];
	selectedFiles?: IFileRow[];
}

const DownloadCommandButton: React.FunctionComponent<IDownloadCommandButtonProps> = (
	p: IDownloadCommandButtonProps
) => {
	const targetButton = React.useRef<HTMLDivElement | null>(null);
	const ButtonComponent = p.defaultRender || CommandBarButton;

	const [getDownloadTokens, { loading }] = useMutation(
		GET_DOWNLOAD_TOKENS_FOR_STACK
	);
	const getDownloadTokensHandler = () => {
		getDownloadTokens({
			variables: {
				stackId: p.selectedStacks![0].key,
			},
		})
			.then((r) => {
				const urls = (r.data.downloadTokensForStack as Array<any>).map(
					(t) => t.id
				);
				DownloadService.downloadFiles(urls, p.selectedStacks![0].name);
			})
			.catch((e: Error) => {
				ToastService.push(
					ErrorToast(
						`An error occurred while trying to download: ${e.message}`
					),
					4
				);
			});
	};

	const numSelected =
		p.selectedStacks!.length > 1
			? `${p.selectedStacks!.length} stacks`
			: 'stack';

	return (
		<div ref={targetButton}>
			<ButtonComponent
				{...(p as any)}
				text={`Download ${numSelected}`}
				iconProps={{ iconName: 'Download' }}
				onClick={getDownloadTokensHandler}
				disabled={loading || p.selectedStacks!.length == 0}
				onRenderIcon={
					loading
						? () => {
								return <Spinner size={SpinnerSize.small} />;
						  }
						: undefined
				}
				split={true}
				subMenuProps={{
					items: [
						{
							key: 'zip',
							text: `Download ${numSelected} as .zip`,
						},
						{
							key: 'unencrypted',
							text: `Download ${numSelected} as encrypted`,
						},
					],
				}}
			/>
		</div>
	);
};

export default DownloadCommandButton;
