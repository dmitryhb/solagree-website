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
  cdfaWebinar: {
    src: `https://player.vimeo.com/video/1194304151?${vimeoPlayerParams}`,
    title: 'Solagree CDFA webinar'
  }
} as const
