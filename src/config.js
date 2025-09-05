export default {
  aiName: 'Nekorites AI', // Nama di Header
  shortAiName: 'n.ai',
  copyright: '© 2025 Fainshe Open Source', // Copyright di Footer
  alertAIText: 'Harap dicatat bahwa respons AI mungkin tidak selalu akurat.', // Alert di halaman Chat
  models: [
    {
      id: 'default',
      name: 'Default',
      endpoint: 'https://backend-serv-774.fainshe.tech/api/v2/chat',
      model: 'Default',
    },
    {
      id: 'yandere',
      name: 'Yandere',
      endpoint: 'https://backend-serv-774.fainshe.tech/api/v2/Yachat',
      model: 'yandere',
    },
    // Kamu bisa menambahkan model lain di sini begitupun API endpointnya
  ],
};
