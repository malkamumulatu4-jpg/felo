/* =========================================================
   CONFIGURATION — edit teams and batches here
   "photo"  = the picture file inside the images/ folder
   "icon"   = emoji shown ONLY if the photo file is missing
   ========================================================= */

const TEAMS = [
  { id: 'love',    name: 'Love Sharing Team', icon: '💛', photo: 'images/photo_2026-10-10_16-47-53.jpg'     },
  { id: 'actions', name: 'Actions Team',      icon: '⚡', photo: 'images/photo_2026-10-10_16-47-50.jpg'     },
  { id: 'worship', name: 'Worship Team',      icon: '🎵', photo: 'images/photo_2026-10-10_16-47-41.jpg'     },
  { id: 'choir', name: 'choir Team',      icon: '📣', photo: 'images/photo_2026-10-10_16-47-38.jpg'     },
  { id: 'art',     name: 'Art Team',          icon: '🎨', photo: 'images/photo_2026-10-10_16-47-53 (2).jpg' },
  { id: 'fund',    name: 'Fund Team',         icon: '💰', photo: 'images/photo_2026-10-10_16-57-19.jpg'     }
];

/* Used only when a "photo" above has no file extension */
const PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/* Minimum number of teams a person must choose when registering */
const MIN_TEAMS = 1;

/* Team passwords now live on the server (Vercel env TEAM_PASSWORDS), not here. */

const BATCHES = [2, 3, 4, 5];

