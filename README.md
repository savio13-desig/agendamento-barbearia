# Agendamento online para barbearia (amostra novapicks)

Demonstração para vender a barbearias, salões e estúdios. HTML, CSS e JavaScript puros, sem build e sem servidor.

## Páginas
- `index.html` — cliente agenda em 4 passos (serviço, profissional, data e horário, dados). Só aparecem horários realmente livres. Confirmação com código, mensagem pronta para o WhatsApp da casa e arquivo `.ics` para o calendário do celular.
- `minha-reserva.html` — o cliente vê, remarca ou cancela pelo código (ou pelas reservas feitas naquele aparelho).
- `painel.html` — painel do dono: agenda por profissional, concluir/faltou/cancelar, encaixe de cliente do balcão, bloqueio de horário (folga, almoço), serviços e preços, novo serviço e agenda de exemplo para demonstrar.
- `fidelidade.html` — cartão fidelidade: cada atendimento marcado como concluído no painel vira um selo.
- `qr.html` — placa de QR para imprimir.
- `apresentacao.html` — proposta comercial (valores de exemplo).

## Adaptar para um novo cliente
Edite `js/dados.js` (nome, endereço, WhatsApp, horários por dia da semana, equipe, serviços, meta de fidelidade) e as cores em `css/estilo.css` (`:root`). Ajuste os planos em `apresentacao.html`.

## Rodar local
```
python -m http.server 8766
```
Abra http://localhost:8766/apresentacao.html

## Limitações desta amostra
- Agendamentos, bloqueios e edições ficam no navegador (localStorage, em `js/agenda.js`). Cliente e painel só se enxergam no mesmo aparelho e navegador. A versão final troca `agenda.js` por um banco online e acrescenta login no painel.
- O lembrete automático por WhatsApp (1 dia antes) não existe na amostra: precisa de servidor e de uma conta do WhatsApp Business.
- Número de WhatsApp (`5511999999999`) e endereço são fictícios.
- Horários usam o relógio do aparelho do cliente.
- `vendor/qrcode.js`: qrcode-generator 1.4.4 (Kazuhiko Arase, licença MIT).
