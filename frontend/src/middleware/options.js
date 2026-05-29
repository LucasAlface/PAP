const operators = [
    { value: "igual", label: "Igual" },
    { value: "maior", label: "Maior que" },
    { value: "menor", label: "Menor que" },
    { value: "maior_igual", label: "Maior ou igual" },
    { value: "menor_igual", label: "Menor ou igual" }
  ];

  export const ativoOptions = [
    { value: "true", label: "Ativo" },
    { value: "false", label: "Inativo" }
  ];

  export function getOperatorOptions() {
    return operators;
  }

  export function getAtivoOptions() {
    return ativoOptions;
  }