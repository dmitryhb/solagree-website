const vimeoPlayerParams = 'title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479'

export const solagreeVimeoVideos = {
  about: {
    src: `https://player.vimeo.com/video/1194304150?${vimeoPlayerParams}`,
    title: 'About Solagree'
  },
  attorneyWebinar: {
    src: `https://player.vimeo.com/video/1194304152?${vimeoPlayerParams}`,
    title: 'Solagree Attorney Webinar'
  },
  attorneyIntro: {
    src: `https://player.vimeo.com/video/1196151849?${vimeoPlayerParams}`,
    title: 'Solagree Attorney Intro'
  },
  cdfaWebinar: {
    src: `https://player.vimeo.com/video/1194304151?${vimeoPlayerParams}`,
    title: 'Solagree CDFA webinar'
  },
  cdfaIntro: {
    src: `https://player.vimeo.com/video/1196147700?${vimeoPlayerParams}`,
    title: 'Solagree CDFA Intro'
  }
} as const
