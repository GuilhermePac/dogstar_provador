# DogStar Pet Style — provador virtual pet

Site estático da **DogStar Banho e Tosa** para experimentar tosas, roupas e acessórios em cachorros — escolhendo um modelo de raça ou enviando a foto do próprio pet.

- 100% front-end: sem backend, banco de dados, login, painel ou serviço pago.
- Tudo roda no navegador do visitante. A foto **nunca** sai do aparelho.
- Publica em qualquer hospedagem estática (Hostinger/cPanel, Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3…).

## Antes de publicar (checklist)

Edite `src/config.ts`:

| Campo | O que colocar |
|---|---|
| `whatsappNumber` | WhatsApp da DogStar, só números com DDI e DDD. Ex.: `5541999999999`. **Enquanto estiver vazio**, os botões abrem o WhatsApp com a mensagem pronta para o visitante escolher o contato. |
| `siteUrl` | Endereço do site, ex.: `https://www.seudominio.com.br` (usado no sitemap e robots). |
| `instagram` | Opcional. |

Depois rode `npm run build` e envie o conteúdo da pasta `dist/`.

## Instalação e comandos

Requer Node.js 20+.

```bash
npm install
npm run dev          # desenvolvimento em http://localhost:5173
npm run build        # gera dist/ (estático, pronto para publicar)
npm run preview      # serve dist/ em http://localhost:4173
npm test             # testes unitários (Vitest)
npm run test:e2e     # testes no navegador (Playwright, desktop + celular)
npm run generate     # regenera ilustrações e JSON a partir de scripts/
```

Para os testes e2e, o Playwright usa o Google Chrome instalado no sistema se existir; senão rode `npx playwright install chromium`.

## Publicação

O `build` gera tudo que cada hospedagem precisa para as URLs amigáveis (`/racas/pug`, `/provador`…) funcionarem:

- **Apache / Hostinger / Locaweb / cPanel:** envie `dist/` para `public_html`. O `.htaccess` já faz o redirecionamento e configura cache e compressão.
- **Netlify / Cloudflare Pages:** pasta de publicação `dist`, comando `npm run build` (o `_redirects` já está incluso).
- **Vercel:** framework "Vite"; adicione um rewrite de `/(.*)` para `/index.html`.
- **GitHub Pages (automático):** o projeto já traz `.github/workflows/deploy.yml`. Envie o código para um repositório na branch `main` e, uma única vez, vá em *Settings › Pages › Build and deployment › Source* e escolha **GitHub Actions**. A cada envio, o GitHub roda os testes, gera o site e publica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/` (a subpasta é configurada sozinha; se o repositório se chamar `SEU-USUARIO.github.io`, o site fica na raiz). O `404.html` gerado mantém os links diretos funcionando.

### Custos

Nenhum serviço pago é usado. O único custo possível é a hospedagem/domínio, e o site cabe com folga em planos gratuitos (Netlify, Cloudflare Pages, GitHub Pages): ~7 MB no total, com ~90 KB de JavaScript inicial (gzip) e imagens carregadas sob demanda.

## Estrutura

```
public/
  images/logo/          logos originais (só fundo removido) em PNG, WebP e AVIF + ícones
  images/dogs/<raça>/<modelo>/<tosa>.svg   ilustrações dos modelos, uma por tosa
  images/clothes/       roupas (fundo transparente), uma imagem por cor
  images/accessories/   acessórios (fundo transparente)
src/
  config.ts             WhatsApp, domínio e mensagens prontas
  data/*.json           raças, modelos, tosas, roupas e acessórios
  canvas/               encaixe automático, desfazer/refazer, composição e exportação PNG
  components/           palco do provador (Stage), comparador antes/depois, layout…
  pages/                páginas (código carregado sob demanda)
  hooks/                estado do provador (com rascunho salvo no aparelho), SEO, avisos
  utils/                validação de upload, IndexedDB, WhatsApp, compartilhamento
  workers/              redimensionamento de fotos fora da thread principal
scripts/                gerador das ilustrações (art/) e fontes de dados (data/)
tests/                  unit/ (Vitest) e e2e/ (Playwright)
```

## Como funciona o provador

- **Camadas:** a base (modelo ou foto) é a camada 1; cada roupa e acessório é uma camada independente. Roupas sempre ficam embaixo dos acessórios, e só uma roupa por vez.
- **Encaixe automático:** cada imagem de modelo tem pontos de referência (cabeça, olhos, orelhas, pescoço, peito, dorso) em `dog-models.json`. Cada item diz em `fit` onde encaixa, qual largura usar como referência e qual ponto da peça fica sobre o ponto do cachorro. Ao trocar a tosa, itens que o visitante ainda não moveu se reposicionam sozinhos.
- **Foto própria:** o visitante toca nos dois olhos e os pontos são calculados a partir deles (inclusive a inclinação da cabeça). Sem marcação, usa um enquadramento padrão e o visitante ajusta.
- **Edição:** arrastar (mouse ou dedo), alça para redimensionar, alça para girar, pinça com dois dedos, controles de tamanho/rotação/opacidade, espelhar, ordem das camadas, remover. Teclado: setas movem (Shift = mais), `+`/`-` tamanho, `[`/`]` giram, `Delete` remove, `Ctrl+Z` / `Ctrl+Shift+Z` desfazem e refazem.
- **Exportação:** a imagem final é composta em Canvas (1200×1320 px PNG) com uma faixa da DogStar dizendo o que a imagem é ("ilustração de referência com montagem" ou "foto original com montagem").
- **Compartilhar:** usa o menu nativo do celular (Web Share API) quando disponível; senão oferece baixar a imagem, enviar a descrição pelo WhatsApp ou copiar o texto.
- **Local:** rascunho, última foto e "Meus looks" ficam no IndexedDB do navegador. Há um botão para apagar tudo em *Meus looks*.

### Transparência (sem IA)

- Tosas nos modelos são **ilustrações prontas** de cada estilo, rotuladas como referência.
- Em fotos próprias, a tosa **não é aplicada** na foto: o visitante vê a referência e marca a tosa desejada, que vai na mensagem para a DogStar.
- Raças de pelo curto mostram só tosa higiênica; pelagens duplas (Husky, Spitz, Golden…) só tosas de acabamento, com aviso de que não devem ser raspadas.

## Adicionar conteúdo

### Nova raça ilustrada
1. Em `scripts/data/breeds.mjs`, copie uma raça parecida e ajuste `slug`, `name`, `size`, `coat`, `ear`, `muzzle`, `tail`, `markings`, textos e `models` (cores).
2. Rode `npm run generate`. O gerador cria as imagens de todas as tosas compatíveis com a pelagem e atualiza os JSON.

### Raça ou modelo com foto real
1. Coloque as imagens em `public/images/dogs/<raça>/<modelo>/<tosa>.webp` — **quadradas, com o cachorro de frente e centralizado** (uma por tosa que você tiver).
2. Em `src/data/breeds.json` e `src/data/dog-models.json`, adicione as entradas com `"source": "photo"` (entradas com `source` diferente de `illustration` são preservadas pelo gerador).
3. `anchors` é opcional: sem ele o provador usa o enquadramento padrão. Para encaixe automático preciso, informe para cada tosa os pontos em fração da imagem (0 a 1), por exemplo `"eyes": {"x":0.5,"y":0.38,"w":0.16}` (`w` = distância entre os olhos); os demais pontos seguem o mesmo formato.

### Nova roupa ou acessório
- **Ilustrado:** adicione em `scripts/art/clothes.mjs` ou `scripts/art/accessories.mjs` e rode `npm run generate`.
- **Imagem pronta (PNG/SVG transparente):** coloque o arquivo em `public/images/clothes/` ou `public/images/accessories/` e adicione a entrada no JSON, com `"source": "photo"`, `w`/`h` (dimensões da imagem) e `fit`:

```json
{
  "id": "laco-azul", "name": "Laço Azul", "category": "lacos",
  "description": "Laço de cetim azul.", "image": "/images/accessories/laco-azul.png",
  "w": 220, "h": 140, "source": "photo",
  "fit": { "anchor": "head", "widthFrom": "head", "widthMul": 0.42, "pivotY": 0.62 }
}
```

`anchor`: `head`, `eyes`, `earL`, `earR`, `neck`, `chest` ou `body`. `widthMul` multiplica a largura de referência; `pivotY` é a altura (0 = topo, 1 = base da imagem) que fica sobre o ponto — ex.: chapéu ≈ 0,85 (aba), bandana ≈ 0,14 (nó), óculos 0,5. Roupas usam `{"anchor":"neck","widthFrom":"body","widthMul":1,"pivotY":0.09}` e devem ter a gola no topo, como as ilustradas.

## Qualidade verificada

- 24 testes unitários e 18 testes ponta a ponta (9 cenários × desktop e celular), cobrindo navegação, seleção de raça e modelo, troca de tosa, upload válido e inválido, recorte, marcação dos olhos, roupas, acessórios, arrastar, redimensionar, girar, remover, desfazer/refazer, exportação PNG, compartilhamento com alternativa, WhatsApp, salvar/reabrir/apagar looks, rascunho após recarregar e ausência de rolagem horizontal.
- Lighthouse (celular): desempenho 93–97, acessibilidade 100, boas práticas 100, SEO 100.
- Não testado automaticamente: gesto de pinça com dois dedos e menu nativo de compartilhamento (dependem de aparelho real).
