module.exports = {
	users: [
		{
			id: 1,
			login: 'root',
			password: 'root',
			firstname: 'Sébastien',
			lastname: 'Nicoletti',
			email: 'sebastien.nicoletti@53js.fr',
			speciality: 'Developpeur',
			projects: [1, 2]
		},
		{
			id: 2,
			login: 'admin',
			password: 'admin',
			firstname: 'Léo-Paul',
			lastname: 'Martin',
			email: 'leopaulmartin@hotmail.fr',
			speciality: 'Expert Oracle',
			projects: [1]
		}
	],
	projects: [
		{
			id: 1,
			name: 'toto',
			description: 'description toto'
		},
		{
			id: 2,
			name: 'azert',
			description: 'description azert'
		}

	]
};
