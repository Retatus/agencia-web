export default [
  {
    path: 'tourist-destinations',
    name: 'tourist-destinations',
    component: () => import('../pages/TouristDestinationManagementPage.vue'),
    meta: {
      title: 'Destinos turísticos',
    },
  },
]
