export interface Game {
  id: string;
  title: string;
  tagline: string;
  description: string;
  howTo: string;
  controls: string;
  category: string;
}

/**
 * Public-facing registry for FRPBOY Games. Descriptions and how-to text are
 * taken from each game's own single-file page under public/games-play/.
 * Every game is free, single-file, and runs offline in the browser.
 */
export const games: Game[] = [
  {
    id: "snake",
    title: "Snake",
    tagline: "The classic snake \u2014 eat, grow, and do not bite your own tail.",
    description: "Play Snake online free in your browser - no download, no sign-up. Steer the snake, eat, grow and beat your best score on mobile or desktop. A FRPBOY single-file game.",
    howTo: "Tap Start and steer the snake with the on-screen pad, by swiping, or with the arrow keys and WASD. Eat the green dots to grow and score 10 points each - but do not hit the walls or your own tail. Pick Easy, Medium or Hard to change the speed. Free to play, no download and no sign-up.",
    controls: "On-screen D-pad, swipe, arrow keys or WASD",
    category: "Arcade",
  },
  {
    id: "2048",
    title: "2048",
    tagline: "Slide and merge the number tiles to reach the 2048 tile.",
    description: "Play 2048 online free on FRPBOY Games. No download needed. Slide and merge tiles to reach 2048 on mobile and desktop.",
    howTo: "2048 is free to play online with no download, on mobile and desktop. Use arrow keys or WASD on desktop, swipe on the grid on mobile, or tap the on-screen arrow buttons. Tiles slide and identical numbers merge into one bigger tile. Reach the 2048 tile to win, then keep going for a higher score. The game ends when the board is full and no moves remain.",
    controls: "Arrow keys or WASD, swipe, on-screen arrow buttons",
    category: "Puzzle",
  },
  {
    id: "flappy",
    title: "Flappy Bird",
    tagline: "Tap to flap through the pipes - one mistake and it is bonk.",
    description: "Play Flappy Bird online free on FRPBOY Games. No download needed. Tap, click or press Space to flap on mobile and desktop.",
    howTo: "Flappy Bird is free to play online with no download, on mobile and desktop. Tap the screen, click, tap the Flappy button, or press Space to make the bird flap and rise. Gravity pulls it down, so time each flap to fly through the gaps in the pipes. Each pipe you pass scores a point. Hit a pipe or the ground and the game is over - press Start / Restart to try again and beat your best score this session.",
    controls: "Tap, click, Flap button, or Space",
    category: "Arcade",
  },
  {
    id: "chess",
    title: "Chess",
    tagline: "Play chess against the computer on Easy, Medium or Hard.",
    description: "Play Chess online free on FRPBOY Games. No download, play instantly on mobile and desktop against the computer with Easy, Medium and Hard difficulty.",
    howTo: "Play Chess free online against the computer. You are White. Tap a piece to select it, green dots show its legal moves, then tap a highlighted square to move. Pawns promote to a queen automatically. Castling and en passant are supported. Checkmate your opponent king to win. No download needed, works on mobile and desktop.",
    controls: "Tap or click a piece, then a highlighted square",
    category: "Board",
  },
  {
    id: "piano",
    title: "Piano",
    tagline: "A playable touch piano - or learn Twinkle Twinkle step by step.",
    description: "Play Piano online free on FRPBOY Games. No download needed, play a touch piano instantly on mobile and desktop with keyboard support and a Twinkle Twinkle learn mode.",
    howTo: "Tap or click the piano keys to play notes, or use your computer keyboard: white keys are A S D F G H J K and black keys are W E T Y U. Turn on Learn: Twinkle Twinkle to follow the highlighted key, press the correct notes in order, and finish the song. Free, no download, and works on mobile and desktop.",
    controls: "Tap or click the keys, or keyboard A-K (white) and W E T Y U (black)",
    category: "Music",
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    tagline: "X vs O against the computer, or pass-and-play with a friend.",
    description: "Play Tic Tac Toe online free on FRPBOY Games. No download needed. Play vs computer or 2 players on mobile and desktop.",
    howTo: "Tic Tac Toe is free to play online with no download, on mobile and desktop. Choose Vs Computer or 2 Players, pick Easy or Hard for the computer, then tap a square to place your mark. X goes first. Get three of your marks in a row, column or diagonal to win - the winning line is highlighted. Scores are tallied for this session, and Restart starts a fresh round.",
    controls: "Tap or click a square",
    category: "Board",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    tagline: "Flip the cards and find all 8 matching pairs in fewer moves.",
    description: "Play Memory Match online free on FRPBOY Games. No download needed, flip cards and find 8 pairs on mobile and desktop in this fun memory game.",
    howTo: "Tap or click a card to flip it, then flip a second card to try to find its matching pair. Remember where symbols are, match all 8 pairs in as few moves and as little time as you can, and use Restart to shuffle and play again. Free, no download, and works on mobile and desktop.",
    controls: "Tap or click cards to flip them",
    category: "Puzzle",
  },
  {
    id: "breakout",
    title: "Breakout",
    tagline: "Bounce the ball, break every brick, and keep 3 lives alive.",
    description: "Play Breakout online free on FRPBOY Games. No download needed, smash bricks with the paddle and ball on mobile and desktop in this classic arcade game.",
    howTo: "Press Start, then move the paddle with your mouse, by dragging on touch screens, or with the left and right arrow keys. Bounce the ball to smash all 5 rows of bricks, score points for every brick, and do not let the ball fall - you have 3 lives. Clear every brick to win. Free, no download, and works on mobile and desktop.",
    controls: "Mouse, touch drag, or left and right arrow keys",
    category: "Arcade",
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    tagline: "Clear the minefield with logic - flag the mines, reveal the rest.",
    description: "Play Minesweeper online free on FRPBOY Games. No download, play instantly on mobile and desktop with Easy, Medium and Hard boards.",
    howTo: "Play Minesweeper free online. Tap a cell to reveal it. Numbers tell you how many mines touch that cell. Avoid all mines and reveal every safe cell to win. Right-click, long-press, or turn on Flag Mode and tap to place a flag where you think a mine is. Your first click is always safe. No download needed, works on mobile and desktop.",
    controls: "Tap to reveal; right-click, long-press or Flag Mode to flag",
    category: "Puzzle",
  },
  {
    id: "tetris",
    title: "Tetris",
    tagline: "Stack the falling blocks and clear lines to level up.",
    description: "Play Tetris online free on FRPBOY Games. No download, play instantly on mobile and desktop with keyboard and touch controls.",
    howTo: "Play Tetris free online. Falling blocks stack on a 10 by 20 board. Move with the left and right arrow keys, press up to rotate, down to move faster, and space for a hard drop. Fill a whole row to clear it and score. The game speeds up as your level rises. Use the on-screen buttons on mobile. No download needed, works on mobile and desktop.",
    controls: "Arrow keys and Space, or on-screen buttons on mobile",
    category: "Puzzle",
  },
  {
    id: "bubble-shooter",
    title: "Bubble Shooter",
    tagline: "Aim, shoot and pop matching bubbles before they cross the line.",
    description: "Play Bubble Shooter online free on FRPBOY Games. No download needed. Aim and pop matching bubbles on mobile and desktop.",
    howTo: "Bubble Shooter is free to play online with no download, on mobile and desktop. Move the mouse or drag on the screen to aim the shooter at the bottom, then click or tap to fire the bubble. Match 3 or more bubbles of the same colour to pop them, and bubbles left hanging drop for bonus points. Every 5 shots that do not pop anything, a new row pushes in from the top. If the bubbles cross the line above the shooter, the game is over. Clear the whole board to win.",
    controls: "Mouse or touch drag to aim, click or tap to shoot",
    category: "Puzzle",
  },
  {
    id: "runner",
    title: "Runner",
    tagline: "Jump the crates and beat your best distance.",
    description: "Play Runner online free on FRPBOY Games. No download needed. Jump obstacles and run as far as you can on mobile and desktop.",
    howTo: "Runner is free to play online with no download, on mobile and desktop. Press Space, the up arrow, or W, tap or click the screen, or tap the Jump button to jump over the crates. The longer you run, the faster it gets, and your score is the distance in metres. Hit a crate and the run is over. Press Start / Restart to go again and beat your best distance this session.",
    controls: "Space, up arrow or W, tap, click, or Jump button",
    category: "Arcade",
  },
];
