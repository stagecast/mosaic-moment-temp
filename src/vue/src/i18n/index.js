import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: {
    ...require('@stagecast/moment-components/lib/locale/en').default,
    help: {
      howto: [
        'Take a selfie and appear in the collage!',
        'The photo collage is created with pictures of the audience.',
        'You can download your pictures to share them on social media.'
      ]
    },
    steps: [
      {
        main: 'Take a selfie and appear in the collage!',
        button: ['Take selfie'],
        description: 'The photo collage is created with pictures of the audience.',
        gallery: 'Your Selfies',
        galleryDescription: 'Download your pictures to share them on social media.'
      },
      {
        main: '',
        button: ['Send to collage', 'Sending...', 'Cancel', 'Done'],
        description: ''
      },
      {
        main: 'Nice Selfie! Your photo will appear in the collage soon.',
        button: ['Take a new selfie'],
        description: ''
      }
    ]
  },
  it: {
    ...require('@stagecast/moment-components/lib/locale/it').default,
    help: {
      howto: [
        'Scatta un selfie per farlo apparire sul grande schermo!',
        'Il collage verrà composto da immagini del pubblico e mostrato durante l\'evento.',
        'Puoi anche scaricare le tue immagini per condividerle sui social media.'
      ]
    },
    steps: [
      {
        main: 'Scatta un selfie per farlo apparire sul grande schermo!',
        button: ['Scatta un selfie'],
        description: 'Il collage di foto verrà mostrato durante l\'evento.',
        gallery: 'Le tue foto',
        galleryDescription: 'Scarica le immagini per condividerle sui social media.'
      },
      {
        main: '',
        button: ['Invia al collage', 'Caricamento...', 'Cancella', 'Fatto'],
        description: ''
      },
      {
        main: 'Nice Shot! La tua foto apparirà presto sul grande schermo.',
        button: ['Scatta di nuovo'],
        description: ''
      }
    ]
  },
  sv: {
    ...require('@stagecast/moment-components/lib/locale/sv').default,
    help: {
      howto: [
        'Tag en selfie för att synas i kollaget!',
        'Fotokollaget skapas av bilder från publiken.',
        'Du kan ladda ned dina bilder och dela dem på sociala media.'
      ]
    },
    steps: [
      {
        main: 'Ta en selfie för att synas på den stora skärmen!',
        button: ['Ta selfie'],
        description: 'Fotokollaget visas på den stora skärmen på eventet',
        gallery: 'Dina selfies',
        galleryDescription: 'Ladda ned dina bilder för att dela dem på sociala media.'
      },
      {
        main: '',
        button: ['Skicka till kollage', 'Skickar...', 'Avbryt', 'Gjort'],
        description: ''
      },
      {
        main: 'Fin selfie! Ditt foto kommer synas i kollaget snart.',
        button: ['Ta en till selfie'],
        description: ''
      }
    ]
  },
  de: {
    ...require('@stagecast/moment-components/lib/locale/de').default,
    help: {
      howto: [
        'Mache ein Selfie und erscheine in der Collage!',
        'Die Fotocollage wird aus Bildern des Publikums erstellt.',
        'Du kannst deine Bilder herunterladen, um sie in deinen Sozialen Medien zu teilen.'
      ]
    },
    steps: [
      {
        main: 'Mache ein Selfie und erscheine auf der großen Leinwand!',
        button: ['Mache ein Selfie'],
        description: 'Die Fotocollage erscheint auf der Leinwand im Veranstaltungsort.',
        gallery: 'Deine Selfies',
        galleryDescription: 'Lade deine Bilder herunter, um sie in Sozialen Medien zu teilen.'
      },
      {
        main: '',
        button: ['Zur Collage senden', 'Wird gesendet...', 'Abbrechen', 'Fertig'],
        description: ''
      },
      {
        main: 'Perfekt getroffen! Dein Foto erscheint in der Collage in Kürze!',
        button: ['Mache ein neues Selfie'],
        description: ''
      }
    ]
  },
  da: {
    ...require('@stagecast/moment-components/lib/locale/da').default,
    help: {
      howto: [
        'Tag en selfie og dukk op i collagen!',
        'Fotocollagen er oprettet med billeder af publikum.',
        'Du kan downloade dine billeder for at dele dem på sociale medier.'
      ]
    },
    steps: [
      {
        main: 'Tag en selfie og dukk op i collagen!',
        button: ['Tag selfie'],
        description: 'Fotocollagen er oprettet med billeder af publikum.',
        gallery: 'Dine selfies',
        galleryDescription: 'Download dine billeder for at dele dem på sociale medier.'
      },
      {
        main: '',
        button: ['Send til collage', 'Afsendelse...', 'Annuller', 'Hecho'],
        description: ''
      },
      {
        main: 'Dejlig selfie! Dit billede vises snart i collagen.',
        button: ['Tag en ny selfie'],
        description: ''
      }
    ]
  },
  fr: {
    ...require('@stagecast/moment-components/lib/locale/fr').default,
    help: {
      howto: [
        'Prenez un selfie et apparaissez dans le collage!',
        'Le collage photo est créé avec des images du public.',
        'Vous pouvez télécharger vos photos pour les partager sur les réseaux sociaux.'
      ]
    },
    steps: [
      {
        main: 'Prenez un selfie et apparaissez dans le collage!',
        button: ['Prenez un selfie'],
        description: 'Le collage photo est créé avec des images du public.',
        gallery: 'Vos selfies',
        galleryDescription: 'Téléchargez vos photos pour les partager sur les réseaux sociaux.'
      },
      {
        main: '',
        button: ['Envoyer au collage', 'Envoi en cours...', 'Annuler', 'Fait'],
        description: ''
      },
      {
        main: 'Jolie photo! Votre photo apparaîtra bientôt dans le collage.',
        button: ['Prenez un nouveau selfie'],
        description: ''
      }
    ]
  },
  es: {
    ...require('@stagecast/moment-components/lib/locale/es').default,
    help: {
      howto: [
        '¡Hazte una selfie y aparece en el collage!',
        'El collage de fotos se crea con imágenes de la audiencia.',
        'Puede descargar sus imágenes para compartirlas en las redes sociales.'
      ]
    },
    steps: [
      {
        main: '¡Hazte una selfie y aparece en el collage!',
        button: ['Tomar selfie'],
        description: 'El collage de fotos se crea con imágenes de la audiencia.',
        gallery: 'Tus selfies',
        galleryDescription: 'Descarga tus imágenes para compartirlas en las redes sociales.'
      },
      {
        main: '',
        button: ['Enviar a collage', 'Enviando...', 'Cancelar', 'Hecho'],
        description: ''
      },
      {
        main: '¡Bonito Selfie! Tu foto aparecerá en el collage pronto.',
        button: ['Toma una nueva selfie'],
        description: ''
      }
    ]
  }
}

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
