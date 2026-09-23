import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Melody } from '../types/melody'
import { MediaPlayer } from './MediaPlayer'

const audioAndVideo: Melody = {
  id: 'bronze-haren',
  title: 'Haren',
  category: 'Bronzeprøven',
  legacyPath: 'bronze/haren',
  audioSrc: '/audio/mp3/bronze/haren.mp3',
  videoMp4Src: '/video/bronze/haren.mp4',
  sheetMusicSrc: '/audio/image/bronze/haren.png',
}

const videoOnly: Melody = {
  id: 'andre-forbundsmarch',
  title: 'Forbundsmarch',
  category: 'Andre',
  legacyPath: 'andre/forbundsmarch',
  videoMp4Src: '/video/andre/forbundsmarch.mp4',
}

const noMedia: Melody = {
  id: 'empty',
  title: 'Tom',
  category: 'Andre',
  legacyPath: 'andre/tom',
}

describe('MediaPlayer', () => {
  it('renders transport, speed and loop controls', () => {
    render(<MediaPlayer melody={audioAndVideo} />)
    expect(screen.getByRole('button', { name: 'Afspil' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Stop og gå til start' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1×' })).toBeInTheDocument()
    expect(screen.getByLabelText('Gentag (loop)')).toBeInTheDocument()
  })

  it('toggles play and pause labels', async () => {
    const user = userEvent.setup()
    render(<MediaPlayer melody={audioAndVideo} />)
    const button = screen.getByRole('button', { name: 'Afspil' })
    await user.click(button)
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
  })

  it('selects a playback speed', async () => {
    const user = userEvent.setup()
    render(<MediaPlayer melody={audioAndVideo} />)
    const fast = screen.getByRole('button', { name: '1.5×' })
    await user.click(fast)
    expect(fast).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows the mode switch only when both audio and video exist', () => {
    const { unmount } = render(<MediaPlayer melody={audioAndVideo} />)
    expect(
      screen.getByRole('button', { name: 'Lyd + noder' }),
    ).toBeInTheDocument()
    unmount()

    render(<MediaPlayer melody={videoOnly} />)
    expect(
      screen.queryByRole('button', { name: 'Lyd + noder' }),
    ).not.toBeInTheDocument()
  })

  it('handles a melody without any playable asset', () => {
    render(<MediaPlayer melody={noMedia} />)
    expect(
      screen.getByText(/ingen lyd- eller videofil/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Afspil' }),
    ).not.toBeInTheDocument()
  })
})
