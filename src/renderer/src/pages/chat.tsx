import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { insertSentence } from '@renderer/database/sentence'
import { useChatApi } from '@renderer/hooks/useChatApi'
import { Action } from '@renderer/lib/promots'
import { useMutation } from '@tanstack/react-query'
import { Aperture, BarChart, Loader, Star } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import SentenceGrammar from './sentence-list/sentence-grammar'

export default function Chat() {
  const [inputValue, setInputValue] = useState(
    `Used by some of the world's largest companies, Next.js enables you to create high-quality web applications with the power of React components.`
  )

  const { fetchSSE, translationData, grammarData, isTranslating, isAnalyzing } =
    useChatApi(inputValue)

  const handleSendMessage = (action: Action) => {
    fetchSSE(action)
  }

  const {
    mutateAsync: createSentence,
    isPending: isCreatingSentence,
    isSuccess: isCreateSentenceSuccess,
    isError: isCreateSentenceError
  } = useMutation({
    mutationKey: ['createSentence', inputValue],
    mutationFn: insertSentence
  })

  isCreateSentenceSuccess && toast.success('添加到备忘录成功')
  isCreateSentenceError && toast.error('添加到备忘录失败')

  return (
    <div>
      <Textarea
        className='min-h-32 mb-4 text-base'
        wrap='hard'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (e.shiftKey) return
            else {
              e.preventDefault()

              handleSendMessage('translate')
            }
          }
        }}
      />
      <div className='flex justify-between'>
        <div></div>
        <div>
          <Button
            size='sm'
            className='mr-2'
            onClick={() => {
              handleSendMessage('translate')
            }}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <Loader
                size='16'
                className='animate-spin mr-2'
              />
            ) : (
              <Aperture
                size='16'
                className='mr-2'
              />
            )}
            翻译
          </Button>
          <Button
            size='sm'
            className='mr-2'
            onClick={() => {
              handleSendMessage('analyze')
            }}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader
                size='16'
                className='animate-spin mr-2'
              />
            ) : (
              <BarChart
                size='16'
                className='mr-2'
              />
            )}
            语法分析
          </Button>
          <Button
            size='sm'
            disabled={
              isTranslating || isAnalyzing || !translationData || !grammarData
            }
            onClick={async () => {
              const res = await createSentence({
                original: inputValue,
                translation: translationData,
                grammar: grammarData
              })
              console.log(res)
            }}
          >
            {isCreatingSentence ? (
              <Loader
                size='16'
                className='mr-2 animate-spin'
              />
            ) : (
              <Star
                size='16'
                className='mr-2'
              />
            )}
            添加到备忘录
          </Button>
        </div>
      </div>
      <div className='mt-4'>
        <div className='font-semibold text-primary text-lg'>原文:</div>
        <p className='whitespace-pre-wrap mt-1'>{inputValue}</p>
      </div>
      {translationData && (
        <div className='mt-4'>
          <div className='font-semibold text-primary text-lg'>译文:</div>
          <p className='whitespace-pre-wrap mt-1'>{translationData}</p>
        </div>
      )}

      {grammarData && (
        <div className='mt-4'>
          <div className='font-semibold text-primary text-lg'>语法分析:</div>
          <div className='mt-2'>
            <SentenceGrammar grammar={grammarData} />
          </div>
        </div>
      )}
    </div>
  )
}
