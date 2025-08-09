// data.js

export const driversData = {
    "Bigode": {
        bonus_categories: ["Jovem", "Caótico", "Barulhento"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Jovem, Caótico ou Barulhento"
    },
    "Lucinha": {
        bonus_categories: ["Adulto", "Tranquilo", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Adulto, Tranquilo ou Silencioso"
    },
    "Montanha": {
        bonus_categories: ["Idoso", "Equilibrado", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Idoso, Equilibrado ou Comunicativo"
    },
    "Paty": {
        bonus_categories: ["Jovem", "Tranquilo", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Jovem, Tranquilo ou Comunicativo"
    },
    "Pedrinho": {
        bonus_categories: ["Adulto", "Caótico", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Adulto, Caótico ou Silencioso"
    },
    "Pereirão": {
        bonus_categories: ["Idoso", "Equilibrado", "Barulhento"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Idoso, Equilibrado ou Barulhento"
    },
};

export const improvementsData = {
    "Wi-Fi e tomadas": {
        bonus_categories: ["Jovem", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Jovem ou Comunicativo"
    },
    "Acessibilidade": {
        bonus_categories: ["Idoso", "Tranquilo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Idoso ou Tranquilo"
    },
    "Assentos Reclináveis": {
        bonus_categories: ["Adulto", "Barulhento"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Adulto ou Barulhento"
    },
    "Ar-condicionado": {
        bonus_categories: ["Caótico", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Caótico ou Silencioso"
    },
    "Banheiro": {
        bonus_categories: ["Adulto", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Adulto ou Silencioso"
    },
    "Sistema de Som": {
        bonus_categories: ["Barulhento", "Caótico"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Barulhento ou Caótico"
    },
    "TV de bordo": {
        bonus_categories: ["Equilibrado", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Equilibrado ou Comunicativo"
    },
    "Cortinas": {
        bonus_categories: ["Idoso", "Caótico"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Idoso ou Caótico"
    }
};

export const passengersData = {
    "Caio (O Estudante)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Silencioso",
        base_points: 4,
        effect: "+1 Ponto para cada Silencioso adjacente."
    },
    "Leandro (O Dorminhoco)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Silencioso",
        base_points: 3,
        effect: "+1 Ponto para cada Silencioso adjacente."
    },
    "Sol (O Good Vibes)": {
        faixa_etaria: "Jovem",
        temperamento: "Tranquilo",
        comportamento: "Silencioso",
        base_points: 2,
        effect: "+1 Ponto por cada Equilibrado e cada Comunicativo no Busão."
    },
    "Rato (O Malandro)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 1,
        effect: "+2 pontos por Idoso no busão."
    },
    "Raul (O Pancada)": {
        faixa_etaria: "Idoso",
        temperamento: "Equilibrado",
        comportamento: "Barulhento",
        base_points: 3,
        effect: "+1 Ponto por cada Jovem e cada Comunicativo Adjacente."
    },
    "Dona Cida (A Tagarela)": {
        faixa_etaria: "Idoso",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 4,
        effect: "+1 Ponto por cada Barulhento adjacente."
    },
    "Fábio (O Vendedor)": {
        faixa_etaria: "Adulto",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 3,
        effect: "Sem efeito."
    },
    "Seu Amadeu (O Irritado)": {
        faixa_etaria: "Idoso",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 5,
        effect: "+1 Ponto por cada Barulhento adjacente."
    },
    "Wesley (DJ do busão)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 3,
        effect: "Ao embarcar, todos os Silenciosos adjacentes desembarcam."
    },
    "Sophia (A Blogueira)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 2,
        effect: "Se houver Wi-Fi e Tomadas, +2 pontos por cada Jovem no Busão."
    },
    "Seu Horácio (O Antisocial)": {
        faixa_etaria: "Idoso",
        temperamento: "Equilibrado",
        comportamento: "Silencioso",
        base_points: 3,
        effect: "+3 Pontos para cada espaço vazio adjacente."
    },
    "Sheila (A Barraqueira)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 4,
        effect: "Ao embarcar, uma coluna inteira desembarca."
    },
    "Célio (O Claustrofóbico)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Silencioso",
        base_points: 3,
        effect: "-1 para cara passageiro adjacente."
    },
    "Márcia e Enzo (A Mãe e o Pestinha)": {
        faixa_etaria: "Adulto",
        temperaria: "Equilibrado",
        comportamento: "Barulhento",
        base_points: 2,
        effect: "-2 Pontos para cada Silencioso no Busão."
    },
    "Luíz (Motolover)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Silencioso",
        base_points: 3,
        effect: "-2 Pontos por passageiro entre ele e o motorista."
    },
    "Fabão (O Grandão)": {
        faixa_etaria: "Adulto",
        temperamento: "Caótico",
        comportamento: "Silencioso",
        base_points: 1,
        effect: "Ao embarcar, faz a coluna inteira desembarcar."
    },
    "Waldisnei (O Cheiroso)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Comunicativo",
        base_points: 0,
        effect: "-1 Ponto para qualquer passageiro adjacente."
    },
    "Cláudio (O Pastor)": {
        faixa_etaria: "Adulto",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 2,
        effect: "-1 ponto para cada Silencioso no busão."
    },
    "Roberto (O Bonzinho)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Comunicativo",
        base_points: 6,
        effect: "Se um Idoso ou Gestante embarcar depois, ele desembarca."
    },
    "Charles (O Maromba)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Barulhento",
        base_points: 4,
        effect: "-1 ponto para cada passageiro adjacente. -3 se Fabão estiver no Busão."
    },
    "Ana (A Gestante)": {
        faixa_etaria: "Adulto",
        temperamento: "Tranquilo",
        comportamento: "Comunicativo",
        base_points: 5,
        effect: "Só embarca se tiver Assentos Reclináveis."
    },
    "João (PCD)": {
        faixa_etaria: "Jovem",
        temperamento: "Equilibrado",
        comportamento: "Silencioso",
        base_points: 6,
        effect: "Só embarca se tiver Acessibilidade."
    },
    "Peter (O Playboy)": {
        faixa_etaria: "Jovem",
        temperamento: "Equilibrado",
        comportamento: "Barulhento",
        base_points: 7,
        effect: "Só embarca se tiver todas as 3 melhorias."
    },
    "Mari (A Conectada)": {
        faixa_etaria: "Jovem",
        temperamento: "Tranquilo",
        comportamento: "Silencioso",
        base_points: 4,
        effect: "Só embarca se houver Wi-Fi e Tomadas."
    },
    "Wilson (O Pai de Planta)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Comunicativo",
        base_points: 5,
        effect: "Ocupa 2 lugares. +1 Ponto para cada Idoso adjacente."
    },
    "Dona Mirtes (A Fofoqueira)": {
        faixa_etaria: "Adulto",
        temperamento: "Tranquilo",
        comportamento: "Comunicativo",
        base_points: 5,
        effect: "Só pontua se estiver adjacente a pelo menos um Comunicativo."
    },
    "??? (O Misterioso)": {
        faixa_etaria: "Adulto",
        temperamento: "Tranquilo",
        comportamento: "Silencioso",
        base_points: 4,
        effect: "Só embarca no fundo do Busão (assentos 6 ou 12)."
    },
    "Jorge (O Perdido)": {
        faixa_etaria: "Adulto",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 4,
        effect: "Embarque imediato em qualquer espaço vago."
    },
    "Dabs (A Board Gamer)": {
        faixa_etaria: "Adulto",
        temperamento: "Tranquilo",
        comportamento: "Comunicativo",
        base_points: 6,
        effect: "Pode fazer até dois passageiros com Penalidade desembarcarem."
    },
    "Dona Fausta (A Desconfiada)": {
        faixa_etaria: "Idoso",
        temperamento: "Caótico",
        comportamento: "Silencioso",
        base_points: 1,
        effect: "Cancela pontos de melhorias se estiver no busão no final."
    },

    "Costelinha (O Caramelo)": {
        faixa_etaria: "Sem faixa etária",
        temperamento: "Sem temperamento",
        comportamento: "Sem comportamento",
        base_points: 1,
        effect: "+1 para cada passageiro no busão."
    },
    "Vovô Michel (O Guia do Busão)": {
        faixa_etaria: "Idoso",
        temperamento: "Equilibrado",
        comportamento: "Barulhento",
        base_points: 0,
        effect: "Dobra os pontos concedidos pelo motorista."
    },
    "Alison (O Mago de Araque)": {
        faixa_etaria: "Adulto",
        temperamento: "Tranquilo",
        comportamento: "Comunicativo",
        base_points: 3,
        effect: "Ao embarcar faz um passageiro à sua escolha em cada busão adversário desembarcar."
    }
};