
export interface Welcome {
    NC:  string;
    NN:  D1N;
    MC:  string;
    MN:  Mn;
    V:   string;
    D1C: string;
    D1N: D1N;
    D2C: string;
    D2N: D2N;
    D3C: string;
    D3N: string;
}

export enum D1N {
    Brasil = "Brasil",
    NívelTerritorial = "Nível Territorial",
}

export enum D2N {
    IPCADessazonalizadoVariaçãoMensal = "IPCA dessazonalizado - Variação mensal",
    Variável = "Variável",
}

export enum Mn {
    Empty = "%",
    UnidadeDeMedida = "Unidade de Medida",
}
