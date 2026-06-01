# BakaTimer — Gerenciador de Maratona de Animes

O **BakaTimer** é uma ferramenta utilitária e minimalista voltada para a comunidade otaku. O objetivo do aplicativo é calcular com precisão o tempo real que um usuário levará para assistir ou alcançar o episódio atual de um anime, descontando aberturas, encerramentos e recapitulações de forma totalmente personalizada.

Interface limpa, moderna, direto ao ponto e sem anúncios.

---

## O Problema que ele resolve

Quem consome muitos animes frequentemente quer planejar o final de semana para maratonar uma temporada inteira (ou alcançar os episódios semanais de uma obra longa), mas calcular o tempo total manualmente gera fricção. Os aplicativos atuais de rastreamento são densos, cheios de propagandas e focados em redes sociais. O **BakaTimer** resolve isso em uma única tela, de forma offline e instantânea.

## Funcionalidades

- **Cálculo Dinâmico:** Descubra exatamente quantas horas e minutos você precisa para finalizar uma temporada.
- **Modo Skip Inteligente:** Caixas de seleção para ignorar dinamicamente:
  - *Openings & Endings* (-3 minutos por episódio).
  - *Recaps / Recapitulações* (-2 minutos por episódio).
- **Interface Minimalista:** Design otimizado no formato *Dark Mode* com foco na legibilidade e experiência do usuário.
- **Uso Sem Cadastro:** Sem necessidade de criar contas ou fazer login. Abriu, calculou, fechou.

## Design & UI/UX

O aplicativo segue uma linha visual moderna inspirada em interfaces *premium* de streaming:
- **Fundo:** Grafite Escuro (`#121212`) para conforto visual.
- **Cores de Destaque:** Laranja Vibrante ou Rosa Neon para botões e resultados.
- **Tipografia:** Textos grandes e centralizados com cantos de cartões arredondados (`borderRadius: 12`), proporcionando um visual flutuante e limpo.

## Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando o ecossistema moderno do React Native:

- **React Native** (Desenvolvimento da interface nativa)
- **Expo Framework** (Gerenciamento, build e execução ágil via Expo Go)
- **JavaScript (ES6+) / TypeScript** (Lógica de estados e cálculos de tempo)
- **React Hooks (`useState`)** (Manipulação de estado dinâmico na tela única)

---

## salva comandos caso precise

porque a execução de scripts foi desabilitada neste sistema.
- Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser     

iniciar no celular no app do expo go 
- npx expo start --tunnel

---
> PS C:\Users\Aluno\Documents\GitHub\--BakaTimer--\modeloexpo> npx expo start --tunnel     Need to install the following packages: expo@56.0.3 Ok to proceed? (y) npm warn deprecated uuid@7.0.3: uuid@10 and below is no longer supported.  For ESM codebases, update to uuid@latest.  For CommonJS codebases, use uuid@11 (but be aware this version will likely be deprecated in 2028). Starting project at C:\Users\Aluno\Documents\GitHub\--BakaTimer--\modeloexpo ConfigError: Cannot determine the project's Expo SDK version because the module `expo` is not installed. Install it with `npm install expo` and try again. npm notice npm notice New minor version of npm available! 11.13.0 -> 11.15.0 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.15.0 npm notice To update run: npm install -g npm@11.15.0 npm notice

##  1. Apague a pasta de dependências antigas e travas (caso existam de forma corrompida) e
- Remove-Item -Recurse -Force node_modules, package-lock.json

## 2. Instale todas as dependências do projeto do zero de forma limpa e
- npm install

## 3. Force a instalação e sincronização correta do pacote do Expo local e
- npx expo install


## Caso de algum error no Ngrok

- npx ngrok config add-authtoken 2eEOvbibw60y01yZ1BRkA2ejgfG_3i7BKuZBR3rzKCE4cGwdS