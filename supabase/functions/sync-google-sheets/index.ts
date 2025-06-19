
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action } = await req.json()
    
    if (action !== 'fetch') {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 現在はサンプルデータを返すが、後でGoogle Sheets APIを実装予定
    const sampleFAQs = [
      {
        question: "勤怠管理システムの使い方を教えてください",
        answer: "勤怠管理システムにログインし、出勤・退勤ボタンをクリックして打刻してください。休憩時間も同様に記録できます。",
        category: "操作方法",
        keywords: "勤怠,打刻,出勤,退勤"
      },
      {
        question: "有給休暇の申請方法は？",
        answer: "人事システムから「休暇申請」を選択し、必要事項を入力して上司に申請してください。承認後に有給が消化されます。",
        category: "契約",
        keywords: "有給,休暇,申請,人事"
      },
      {
        question: "経費精算の締切はいつですか？",
        answer: "毎月25日までに経費精算システムへ入力し、承認を完了させてください。遅れると翌月の精算となります。",
        category: "料金",
        keywords: "経費,精算,締切,申請"
      }
    ];

    return new Response(
      JSON.stringify({ faqs: sampleFAQs }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
