// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
const menuLinkGroups: INavLinkGroup[] = [
	{
		links: [
			{
				name: 'Home',
				key: '/',
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
						name: 'Clips',
						key: '/Home/Clips',
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
				key: '/Settings/Account',
			},
		],
	},
];

export default menuLinkGroups;
