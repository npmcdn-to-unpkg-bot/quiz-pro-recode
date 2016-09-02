export default {
  "quiz_id":1,
  "quiz_name":"测验1",
  "is_pass":true,
  "result_count":1,
  "quiz_user_count":2,
  "quiz_pass_user_count":2,
  "question_array":[
    {
      "question_id":1,
      "question_name":"测试1问题1",
      "type":"OPTION_SINGLE",
      "option_array":[
        {"option_id":1,"option_name":"测验1问题1 候选项1"},
        {"option_id":2,"option_name":"测验1问题1 候选项2"},
        {"option_id":3,"option_name":"测验1问题1 候选项3"},
        {"option_id":4,"option_name":"测验1问题1 候选项4"}
      ],
      "state":"NORMAL"
    },
    {
      "question_id":2,
      "question_name":"测试1问题2",
      "type":"OPTION_MULTI",
      "option_array":[
        {"option_id":5,"option_name":"测验1问题2 候选项1"},
        {"option_id":6,"option_name":"测验1问题2 候选项2"},
        {"option_id":7,"option_name":"测验1问题2 候选项3"},
        {"option_id":8,"option_name":"测验1问题2 候选项4"}
      ],
      "state":"NORMAL"
    },
    {
      "question_id":3,
      "question_name":"测试1问题3",
      "type":"TRUE_FALSE",
      "state":"NORMAL"
    }
  ]
}



