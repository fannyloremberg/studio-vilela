# Studio Vilela — prévia do site (não publicada)
Site estático (HTML/CSS/JS), pronto para GitHub Pages. Abra `index.html`.

## Falta preencher (caixinhas amarelas no site)
- WhatsApp: Rafaela Vilela (11) 94269-4714 — unhas e maquiagem (`WA`); Jennyfer Vilela (11) 99596-5175 — sobrancelha, cílios e tranças (`WA_JEN`). Botões com `data-quem="jen"` vão para a Jennyfer.
- depoimentos reais.

Endereço (confirmado): R. Padre Marçal, 112 - Centro, São Roque - SP, CEP 18120-000 — mapa do Google embutido + botão Como chegar.

## Recursos
- Hero com vídeo mudo em loop (`video/hero.mp4`, 14 s, 1280×720, ~0,7 MB) + pôster, véu cinza/dourado e brilhos dourados (canvas).
- Assistente **Vily** (fadinha borboleta, por regras, sem IA): agendar, serviços, valores (sob consulta), horário, onde fica, falar com o studio.
- **Ativar a fala**: guia por voz no estilo da COMPSISTEM. As falas fixas (introdução, 10 passos do guia, menus e respostas da Vily) são MP3s gravados com a voz neural **Microsoft Thalita Multilingual** (pt-BR), em `voz/`. O primeiro áudio começa dentro do toque em Ativar a fala (necessário no iPhone). Se o som não começar em cerca de 1,5 s, aparece um aviso para tirar o modo silencioso e aumentar o volume. Textos dinâmicos (FAQ, toque/foco no conteúdo) usam a Web Speech API do navegador como reserva. Desligado por padrão, lembra a escolha (`localStorage`).
- Galeria com lightbox, FAQ, depoimentos (modelo), faixa de chamada, animações de entrada.
- `prefers-reduced-motion`: sem vídeo (só pôster), sem brilhos e sem animações.

## Imagens
- Borboleta dourada (`img/borboleta.webp`) e fadinha Vily (`img/fada.webp`, `img/fada-avatar.webp`): arte original gerada para este projeto, recortada com fundo transparente.
- `logo-foto.jpg`: foto do logo do studio (enviada pela família).

## Créditos (Pexels, licença livre — https://www.pexels.com/license/)
Fotos: Kaboompics (4963818, unhas — card de serviço), Shiny Diamond (3762664, sobrancelha — card de serviço), Nataliya Vaitkevich (5128220, cílios), Valdans Media (30589139).
Vídeos do hero: Artem Podrez — https://www.pexels.com/video/4783390/ ; Pavel Danilyuk — https://www.pexels.com/video/4855852/ ; Kaboompics — https://www.pexels.com/video/7311589/ . Recortados, sem áudio e sem texto na tela.

Horário: terça a sábado somente com hora marcada; domingo e segunda fechado.

Card de Tranças (`img/trancas-box.jpg`): imagem ilustrativa original gerada para este projeto (não é foto de cliente).

Pagamento: aceita dinheiro. Duração: de 20 min a 3h30, ou mais, conforme o procedimento. Casamentos e eventos: com hora marcada, confirmar antes com as profissionais.

Galeria: 7 fotos reais de trabalhos do studio (`img/trabalhos/`, do Instagram @studiovvilela_, enviadas pela família), exibidas em tamanho pequeno/médio.
