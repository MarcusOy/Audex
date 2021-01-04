// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
const menuLinkGroups: INavLinkGroup[] = [
	{
		links: [
			{
				name: 'Home',
				// key: '/home/Recent',
				links: [
					{
						name: 'Recent',
						key: '/Home/Recent',
					},
					{
						name: 'Files',
						key: '/Home/Files',
					},
					{
						name: 'Devices',
						key: '/Home/Devices',
					},
				],
				isExpanded: true,
			},
			{
				name: 'User Management',
				key: '/Users',
			},
			{
				name: 'Settings',
				key: '/Settings',
			},
		],
	},
];

export default menuLinkGroups;
