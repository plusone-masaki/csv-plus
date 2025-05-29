import { vi } from 'vitest'
import electronMock from './electron'

vi.mock('electron', () => electronMock)
