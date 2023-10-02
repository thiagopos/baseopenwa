const wa = require('@open-wa/wa-automate');

wa.create({
  sessionId: "SMS_WA",
  multiDevice: true,
  authTimeout: 60,
  blockCrashLogs: true,
  disableSpins: true,
  headless: "new",
  hostNotificationLang: 'PT_BR', // Idioma das notificações do host (servidor)
  logConsole: false,
  popup: true,
  qrTimeout: 0,
}).then(client => iniciar(client));

// Armazenar o estado da conversa para cada usuário com timestamps
const estadoConversa = {};

function iniciar(client) {
  client.onMessage(async message => {
    const { from, body } = message;

    if (body.toLowerCase() === '_oi' || body.toLowerCase() === 'opções') {
      // Se o usuário enviar "oi" ou "opções", responda com o menu
      await client.sendText(from, 'Por favor, selecione uma opção:\nA. Opção A\nB. Opção B\nC. Opção C\nD. Opção D\nE. Encerrar Conversa');
      estadoConversa[from] = {
        estado: 'menu',
        ultimaAtividade: Date.now(), // Armazena o carimbo de data/hora da última atividade
      };
    } else if (estadoConversa[from] && estadoConversa[from].estado === 'menu') {
      // Lidar com as opções do menu
      switch (body.toLowerCase()) {
        case 'a':
          await client.sendText(from, 'Você selecionou a Opção A.');
          break;
        case 'b':
          await client.sendText(from, 'Você selecionou a Opção B.');
          break;
        case 'c':
          await client.sendText(from, 'Você selecionou a Opção C.');
          break;
        case 'd':
          await client.sendText(from, 'Você selecionou a Opção D.');
          break;
        case 'e':
          await client.sendText(from, 'Encerrando a conversa. Adeus!');
          // Remover o estado da conversa ao encerrar a conversa
          delete estadoConversa[from];
          break;
        default:
          await client.sendText(from, 'Opção inválida. Por favor, selecione uma opção válida (A-E).');
          break;
      }
    } else {
      // Lidar com outras mensagens aqui com base no estado da conversa
      await client.sendText(from, `Não tenho certeza do que você quer. Digite "Opções" para ver as opções.`);
    }
  });

  // Verificar periodicamente a inatividade e limpar o estado da conversa
  setInterval(() => {
    const agora = Date.now();
    for (const usuario in estadoConversa) {
      const ultimaAtividade = estadoConversa[usuario].ultimaAtividade;
      const tempoInativo = agora - ultimaAtividade;
      // Defina seu limite de tempo ocioso em milissegundos (por exemplo, 30 minutos)
      const limiteInatividade = 30 * 60 * 1000; // 30 minutos
      if (tempoInativo >= limiteInatividade) {
        delete estadoConversa[usuario]; // Remover o estado da conversa para usuários inativos
      }
    }
  }, 10 * 60 * 1000); // Verificar a cada 10 minutos
}
