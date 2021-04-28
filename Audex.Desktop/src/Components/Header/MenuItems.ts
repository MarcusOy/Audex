// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
const menuLinkGroups: INavLinkGroup[] = [
	{
		links: [
			{
				name: 'Home',
				links: [
					{
						name: 'Dashboard',
						key: '/Home/Dashboard',
					},
					{
						name: 'Stacks',
						key: '/Home/Stacks',
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
