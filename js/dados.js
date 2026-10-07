/* Dados do cliente. Para vender para outra barbearia ou salão, troque só este arquivo. */
window.BARBEARIA = {
  nome: "Navalha & Co.",
  slogan: "Barbearia clássica · Pinheiros",
  endereco: "Rua Exemplo, 123 · Pinheiros, São Paulo",
  whatsapp: "5511999999999", // número que recebe as confirmações (DDI+DDD+número)
  passoMin: 30,              // intervalo entre horários, em minutos
  antecedenciaMin: 60,       // antecedência mínima para marcar no mesmo dia
  diasAFrente: 14,
  /* horário por dia da semana (0 = domingo). Sem a chave = fechado. */
  horarios: {
    2: [["09:00", "12:00"], ["13:00", "20:00"]],
    3: [["09:00", "12:00"], ["13:00", "20:00"]],
    4: [["09:00", "12:00"], ["13:00", "20:00"]],
    5: [["09:00", "12:00"], ["13:00", "20:00"]],
    6: [["09:00", "12:00"], ["13:00", "17:00"]]
  },
  profissionais: [
    { id: 1, nome: "Rafa", esp: "Degradê e navalhado" },
    { id: 2, nome: "Thiago", esp: "Barba e clássicos" },
    { id: 3, nome: "Bia", esp: "Cortes e química" }
  ],
  servicos: [
    { id: 1, nome: "Corte masculino", desc: "Máquina e tesoura, lavagem e finalização.", dur: 30, preco: 55 },
    { id: 2, nome: "Barba", desc: "Toalha quente, navalha e hidratação.", dur: 30, preco: 40 },
    { id: 3, nome: "Corte + Barba", desc: "O combo completo, com desconto.", dur: 60, preco: 85, tag: "Mais pedido" },
    { id: 4, nome: "Corte infantil", desc: "Até 10 anos, com paciência de sobra.", dur: 30, preco: 45 },
    { id: 5, nome: "Acabamento e sobrancelha", desc: "Pezinho, nuca e sobrancelha na navalha.", dur: 30, preco: 25 },
    { id: 6, nome: "Platinado / Coloração", desc: "Descoloração e tonalização. Reserva 2 horas.", dur: 120, preco: 180, tag: "Novidade" }
  ],
  fidelidade: { meta: 10, premio: "1 corte grátis" }
};
