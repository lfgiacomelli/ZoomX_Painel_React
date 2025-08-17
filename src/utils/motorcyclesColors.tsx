export function mapColor(cor: string | undefined) {
    if (!cor) return "black";

    switch (cor.toLowerCase()) {
        case "amarelo":
        case "amarela":
            return "yellow";
        case "preto":
        case "preta":
            return "black";
        case "branco":
        case "branca":
            return "white";
        case "vermelho":
        case "vermelha":
            return "red";
        case "azul":
        case "azula":
            return "blue";
        case "verde":
        case "verda":
            return "green";
        case "laranja":
            return "orange";
        case "rosa":
            return "pink";
        case "roxo":
        case "roxa":
            return "purple";
        case "cinza":
        case "prata":
            return "gray";
        case "marrom":
            return "brown";
        case "bege":
            return "beige";
        case "dourado":
            return "gold";
        case "cobre":
            return "darkorange";
        default:
            return "black"; // cor padrão caso não reconheça
    }
}
