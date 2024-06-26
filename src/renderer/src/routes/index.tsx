import Chat from '@renderer/pages/chat'
import Correct from '@renderer/pages/correct'
import SentenceDetail from '@renderer/pages/sentence/sentence-detail'
import SentenceGroupHome from '@renderer/pages/sentence/sentence-group-home'
import WordList from '@renderer/pages/word/word-list'
import {
  MessageCircleQuestion,
  SpellCheck2,
  Swords,
  Trophy
} from 'lucide-react'

export type RoutePath =
  | 'chat'
  | 'sentence-list'
  | 'word-list'
  | 'sentence-list/:id'
  | 'correct'

export type RouteItem = {
  path: RoutePath | ':id'
  component: React.ReactNode
  icon?: React.ReactNode
  isMenu: boolean
  keepAlive?: boolean
  text: string
  children?: RouteItem[]
}

export const routes: RouteItem[] = [
  {
    path: 'chat',
    component: <Chat />,
    text: 'Chat',
    isMenu: true,
    keepAlive: true,
    icon: <MessageCircleQuestion size={18} />
  },
  {
    path: 'sentence-list',
    component: <SentenceGroupHome />,
    text: 'Sentence List',
    isMenu: true,
    icon: <Trophy size={18} />
  },
  {
    path: 'sentence-list/:id',
    component: <SentenceDetail />,
    text: 'Sentence Detail',
    isMenu: false
  },
  {
    path: 'word-list',
    component: <WordList />,
    text: 'Word List',
    isMenu: true,
    icon: <Swords size={18} />
  },
  {
    path: 'correct',
    component: <Correct />,
    text: 'Correct',
    isMenu: true,
    keepAlive: true,
    icon: <SpellCheck2 size={18} />
  }
]
