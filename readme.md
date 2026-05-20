# 📱 BakaTimer — Gerenciador de Maratona de Animes

O **BakaTimer** é uma ferramenta utilitária e minimalista voltada para a comunidade otaku. O objetivo do aplicativo é calcular com precisão o tempo real que um usuário levará para assistir ou alcançar o episódio atual de um anime, descontando aberturas, encerramentos e recapitulações de forma totalmente personalizada.

Interface limpa, moderna, direto ao ponto e sem anúncios.

---

## 💡 O Problema que ele resolve

Quem consome muitos animes frequentemente quer planejar o final de semana para maratonar uma temporada inteira (ou alcançar os episódios semanais de uma obra longa), mas calcular o tempo total manualmente gera fricção. Os aplicativos atuais de rastreamento são densos, cheios de propagandas e focados em redes sociais. O **BakaTimer** resolve isso em uma única tela, de forma offline e instantânea.

## 🚀 Funcionalidades

- **Cálculo Dinâmico:** Descubra exatamente quantas horas e minutos você precisa para finalizar uma temporada.
- **Modo Skip Inteligente:** Caixas de seleção para ignorar dinamicamente:
  - *Openings & Endings* (-3 minutos por episódio).
  - *Recaps / Recapitulações* (-2 minutos por episódio).
- **Interface Minimalista:** Design otimizado no formato *Dark Mode* com foco na legibilidade e experiência do usuário.
- **Uso Sem Cadastro:** Sem necessidade de criar contas ou fazer login. Abriu, calculou, fechou.

## 🎨 Design & UI/UX

O aplicativo segue uma linha visual moderna inspirada em interfaces *premium* de streaming:
- **Fundo:** Grafite Escuro (`#121212`) para conforto visual.
- **Cores de Destaque:** Laranja Vibrante ou Rosa Neon para botões e resultados.
- **Tipografia:** Textos grandes e centralizados com cantos de cartões arredondados (`borderRadius: 12`), proporcionando um visual flutuante e limpo.

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando o ecossistema moderno do React Native:

- **React Native** (Desenvolvimento da interface nativa)
- **Expo Framework** (Gerenciamento, build e execução ágil via Expo Go)
- **JavaScript (ES6+) / TypeScript** (Lógica de estados e cálculos de tempo)
- **React Hooks (`useState`)** (Manipulação de estado dinâmico na tela única)

## 📦 Como Executar o Projeto

Para rodar este aplicativo localmente no seu dispositivo utilizando o **Expo Go**, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/bakatimer.git](https://github.com/seu-usuario/bakatimer.git)
   cd bakatimer