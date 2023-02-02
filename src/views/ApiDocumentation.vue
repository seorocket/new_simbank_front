<template lang="pug">
  div
    q-card
      q-card-actions
        h1 Документация API
      q-separator
      q-card-section
        h2 Общее
        p API используется для автоматизации рутинных задач в облаке и позволяет управлять элементами инфраструктуры с помощью HTTP-запросов.
        h2 Авторизация
        p Доступ к API осуществляется с помощью Authorization - токена, сгенерированного сервисом
        p Его необходимо передавать в заголовке каждого запроса в формате:
        pre Authorization: Token {{ token }}
        p В случае ошибки серевер отдаст:
        pre {'detail': 'Учетные данные не были предоставлены.'}
        // Список GOIP Линий
        h2 GOIP линии
        p Получить состояние портов GOIP шлюза:
          br
          | Нужно для того чтобы отслеживать статус симкарт активированных в GOIP шлюзе.
          br
          | При активации симкарты дожидаемся когда оба поля "login" и "gsm_status" станут
          |
          span.code.post ONLINE или IDLE
        p После этого симкарты готовы к приему СМС
        code
          span.code GET
          | /api/gateway/state/
        p Пример ответа:
        pre
          |[
          |    {
          |        "line_id": str,
          |        "login": str,
          |        "gsm_status": str,
          |        "operator": str,
          |        "signal": str,
          |        "sim_id": str,
          |        "imei": str,
          |        "id": int,
          |        "phone_number": str
          |    }
          |]
        // Симкарты
        h2 SIM карты
        p Возвращает список SIM карт
        code
          span.code GET
          | /api/sim/
        p Пример ответа:
        pre
          |[{
          |  "id": int,
          |  "name": str,
          |  "add_dt": date,
          |  "status": bool,
          |  "smb_slot": int,
          |  "goip_id": str,
          |  "client": int,
          |  "operator": object,
          |  "smb": int
          | }]
        code
          span.code GET
          | /api/sim/{id}
        p Пример ответа:
        pre
          |{
          |  "id": int,
          |  "name": str,
          |  "add_dt": date,
          |  "status": bool,
          |  "smb_slot": int,
          |  "goip_id": str,
          |  "client": int,
          |  "operator": object,
          |  "smb": int
          | }
        code.code.post
          span.code.post POST
          | /api/sim/upload_sim/
        p Добавить в аккаунт список сим карт вставленных в SIM банк
        pre Пример ответа:
          br
          | {"created": int}
        code.code.post
          span.code.post POST
          | /api/sim/{id}/activate_sim/
        p Для того чтобы активировать сим карту нужно указать свободный "line_id" GOIP Шлюза
        pre Входные данные:
          br
          | line_id - ID линии GOIP шлюза
          br
          | {"line_id": int}
        code.code.post
          span.code.post POST
          | /api/sim/{id}/send_sms/
        p Отправка СМС с номера, сим карта должна быть активирована, прежде чем отправлять СМС
        pre Входные данные:
          br
          | line_id - ID линии GOIP шлюза куда вставлена симкарта
          br
          | msg - Сообщение получателю
          br
          | phone - Телефон получателя
          br
          |{
          |    "line_id": int,
          |    "msg": str,
          |    "phone": str,
          |}
        code.code.delete
          span.code.delete DELETE
          | /api/sim/
        p Удалить все SIM карты
        p Пример ответа:
        pre {'deleted': int} - количество удаленных SIM карт
        code.code.delete
          span.code.delete DELETE
          | /api/sim/{id}
        p Удалить SIM карту по ID
        pre Код ответа: 204
        // Получение СМС
        h2 Получение СМС
        p Получить все входящие смс, по указанным диапазонам дат
        code
          span.code GET
          | /api/scheduler/get_all_sms/?start=YYYY-mm-dd HH:MM:SS&end=YYYY-mm-dd HH:MM:SS
        p Обязательные параметры:
        pre
          | Входные данные:
          | start - Пример: 2020-01-01 00:00:00
          | end - Пример: 2020-01-01 23:59:59
        p Пример ответа:
        pre
          |[
          |    {
          |        "sms_sender": str,
          |        "datetime": datetime,
          |        "content": str,
          |        "phone": str
          |    }
          |]
</template>

<script>
import mixins from "../plugins/general"
import {mapState} from "vuex"

export default {
  mixins: [mixins],
  computed: {
    ...mapState([
      'token',
    ])
  },
  data () {
    return {}
  }
}
</script>
<style scoped>
  h1 {
    margin: 0 10px;
    font-size: 25px;
    line-height: 40px;
  }
  h2 {
    margin: 10px 0;
    font-size: 25px;
    line-height: 50px;
    border-left: 3px solid #027be3;
    padding-left: 15px;
  }
  pre {
    background: #09161f;
    color: #fff;
    padding: 20px;
    border-radius: 7px;
    font-size: 16px;
  }
  span.code {
    color: #fff;
    background: #65b1fb;
    border-radius: 5px;
    padding: 5px 10px;
    margin-right: 15px;
  }
  span.success {

  }
  span.post {
    background: #60b760;
  }
  span.delete {
    background: #d75453;
  }
  code {
    background: #e0effe;
    padding: 15px;
    font-weight: 600;
    font-size: 20px;
    border-radius: 5px;
    display: block;
    margin-bottom: 20px;
  }
  code.delete {
    background: #f7dddd;
  }
  code.post {
    background: #dff1df;
  }
  p {
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
  }
</style>
