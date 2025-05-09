import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Exercício 1
function calculaSomaIndice(): number {
  let INDICE = 13, SOMA = 0, K = 0;
  while (K < INDICE) {
    K = K + 1;
    SOMA = SOMA + K;
  }
  return SOMA;
}

// Exercício 2
function verificaFibonacci(num: number): string {
  let a = 0, b = 1;
  while (b < num) {
    [a, b] = [b, a + b];
  }
  return num === 0 || b === num
    ? `${num} pertence à sequência de Fibonacci.`
    : `${num} NÃO pertence à sequência de Fibonacci.`;
}

// Exercício 4
function calculaPercentualEstados() {
  const estados = {
    SP: 67836.43,
    RJ: 36678.66,
    MG: 29229.88,
    ES: 27165.48,
    Outros: 19849.53,
  };
  const total = Object.values(estados).reduce((a, b) => a + b, 0);
  return Object.entries(estados).map(([estado, valor]) => ({
    estado,
    percentual: ((valor / total) * 100).toFixed(2),
  }));
}

// Exercício 5
function inverterTexto(texto: string): string {
  let resultado = "";
  for (let i = texto.length - 1; i >= 0; i--) {
    resultado += texto[i];
  }
  return resultado;
}

// Exercício 3 - Processamento do faturamento
async function processarFaturamentoArquivo(arquivo: File) {
  const texto = await arquivo.text();
  const dados = texto.trim().startsWith("[")
    ? JSON.parse(texto)
    : Array.from(new DOMParser().parseFromString(`<root>${texto}</root>`, "application/xml").getElementsByTagName("row"), (el) => ({
        dia: parseInt(el.querySelector("dia")?.textContent || "0"),
        valor: parseFloat(el.querySelector("valor")?.textContent || "0"),
      }));

  const dadosValidos = dados.filter((d: any) => d.valor > 0);
  const media = dadosValidos.reduce((acc: number, d: any) => acc + d.valor, 0) / dadosValidos.length;
  const menor = Math.min(...dadosValidos.map((d: any) => d.valor));
  const maior = Math.max(...dadosValidos.map((d: any) => d.valor));
  const acimaDaMedia = dadosValidos.filter((d: any) => d.valor > media).length;

  return { menor, maior, media, acimaDaMedia };
}

export default function App() {
  const [fibonacciInput, setFibonacciInput] = useState(0);
  const [fibonacciResult, setFibonacciResult] = useState("");
  const [reverseInput, setReverseInput] = useState("");
  const [reversed, setReversed] = useState("");
  const [resultadoFaturamento, setResultadoFaturamento] = useState<any>(null);

  return (
    <main className="p-6 grid gap-6">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">1. Soma de 1 até 13</h2>
          <p>Resultado: {calculaSomaIndice()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">2. Fibonacci</h2>
          <Input
            type="number"
            placeholder="Informe um número"
            value={fibonacciInput}
            onChange={(e) => setFibonacciInput(Number(e.target.value))}
          />
          <Button className="mt-2" onClick={() => setFibonacciResult(verificaFibonacci(fibonacciInput))}>
            Verificar
          </Button>
          <p className="mt-2">{fibonacciResult}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">3. Faturamento - JSON/XML</h2>
          <Label className="mb-1 block">Escolha um arquivo JSON ou XML:</Label>
          <Input
            type="file"
            accept=".json,.xml"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const result = await processarFaturamentoArquivo(file);
                setResultadoFaturamento(result);
              }
            }}
          />
          {resultadoFaturamento && (
            <div className="mt-3 space-y-1">
              <p>Menor faturamento: R$ {resultadoFaturamento.menor.toFixed(2)}</p>
              <p>Maior faturamento: R$ {resultadoFaturamento.maior.toFixed(2)}</p>
              <p>Dias acima da média: {resultadoFaturamento.acimaDaMedia}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">4. Percentual por Estado</h2>
          <ul className="list-disc ml-6">
            {calculaPercentualEstados().map((e) => (
              <li key={e.estado}>
                {e.estado}: {e.percentual}%
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">5. Inverter String</h2>
          <Input
            placeholder="Digite uma string"
            value={reverseInput}
            onChange={(e) => setReverseInput(e.target.value)}
          />
          <Button className="mt-2" onClick={() => setReversed(inverterTexto(reverseInput))}>
            Inverter
          </Button>
          <p className="mt-2">Resultado: {reversed}</p>
        </CardContent>
      </Card>
    </main>
  );
}
