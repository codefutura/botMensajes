import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const PORT = process.env.PORT ?? 3002

const discordFlow = addKeyword<Provider, Database>('doc').addAnswer(
    ['You can see the documentation here', '📄 https://builderbot.app/docs \n', 'Do you want to continue? *yes*'].join(
        '\n'
    ),
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic }) => {
        if (ctx.body.toLocaleLowerCase().includes('yes')) {
            return gotoFlow(registerFlow)
        }
        await flowDynamic('Thanks!')
        return
    }
)

/*const welcomeFlow = addKeyword<Provider, Database>(['hi', 'hello', 'hola'])
    .addAnswer(`🙌 Hello welcome to this *Chatbot*`)
    .addAnswer(
        [
            'I share with you the following links of interest about the project',
            '👉 *doc* to view the documentation',
        ].join('\n'),
        { delay: 800, capture: true },
        async (ctx, { fallBack }) => {
            if (!ctx.body.toLocaleLowerCase().includes('doc')) {
                return fallBack('You should type *doc*')
            }
            return
        },
        [discordFlow]
    )
*/
/*
const welcomeFlow = addKeyword<Provider, Database>([
    'hola','hello',
    'buenas',
    'saldo',
    'balance',
    'dinero',
    'disponible',
    'cuenta',
    'consulta',
    'cuánto tengo',
    'cuánto dinero tengo',
    'mi saldo',
    'ver balance'
  ])
    .addAnswer('🙌 ¡Hola! Bienvenido al Sistema de Consulta de Balance Facloud! 💰')
    .addAnswer(
      [
        'Estoy aquí para ayudarte a conocer tu *saldo disponible* o *balance actual* de tu cuenta.',
        '👉 Escribe la palabra *consultar* para verificar tu balance.',
      ].join('\n'),
      { delay: 800, capture: true },
      async (ctx, { fallBack }) => {
        const mensaje = ctx.body.toLowerCase()
        if (!mensaje.includes('consultar')) {
          return fallBack('Por favor, escribe la palabra *consultar* para continuar.')
        }
        return
      },
      [discordFlow] // Aquí podrías reemplazar esto con el flujo que muestra el balance real del cliente
    )
*/
const welcomeFlow = addKeyword<Provider, Database>([
    'hola', 'hello', 'buenas', 'saldo', 'balance', 'dinero', 'disponible', 'cuenta', 'consulta', 'cuánto tengo', 'cuánto dinero tengo', 'mi saldo', 'ver balance'
  ])
    .addAnswer('🙌 ¡Hola! Bienvenido al Sistema de Consulta de Balance FaCloud! 💰')
    .addAnswer(
      [
        'Selecciona una de las siguientes opciones escribiendo el número correspondiente:',
        '1️⃣ Ver opciones de pago',
        '2️⃣ Consultar balance',
        '3️⃣ Ver detalles de cuentas',
      ].join('\n'),
      { capture: true },
      async (ctx, { gotoFlow, fallBack }) => {
        const mensaje = ctx.body.trim()
  
        switch (mensaje) {
          case '1':
            return gotoFlow(pagosFlow) // Define este flujo para mostrar opciones de pago
          case '2':
            return gotoFlow(balanceFlow) // Define este flujo para consultar el balance
          case '3':
            return gotoFlow(detallesCuentasFlow) // Define este flujo para ver detalles de cuentas
          default:
            return fallBack('❌ Opción no válida. Por favor, responde con *1*, *2* o *3*.')
        }
      }
    )
    
const pagosFlow = addKeyword(['opciones de pago', 'pago', 'pagos'])
    .addAnswer(
      [
        '💳 *Opciones de Pago Disponibles:*',
        '1. Transferencia bancaria',
        '2. Pago en línea con tarjeta',
        '3. Depósito en efectivo',
        '',
        '¿Deseas recibir más información sobre alguna opción? Responde con el número correspondiente.'
      ].join('\n'),
      { capture: true },
      async (ctx, { fallBack }) => {
        const msg = ctx.body.trim()
        if (!['1', '2', '3'].includes(msg)) {
          return fallBack('Por favor, responde con *1*, *2* o *3* para más información.')
        }
        // Aquí podrías personalizar las respuestas dependiendo de la opción elegida
      }
    ) 

const balanceFlow = addKeyword(['consultar balance', 'consultar', 'saldo'])
    .addAnswer('💰 Consultando tu balance actual...')
    .addAnswer(
      '✅ Tu saldo disponible es: *RD$ 5,420.00*', // Aquí deberías usar una consulta real a la DB
      { delay: 1000 }
    )

const detallesCuentasFlow = addKeyword(['detalles', 'cuenta', 'ver detalles'])
    .addAnswer(
      [
        '📋 *Detalles de tu cuenta:*',
        '- Titular: Juan Pérez',
        '- Tipo de cuenta: Corriente',
        '- Último movimiento: 12/04/2025 - Compra RD$ 1,200.00',
        '',
        '¿Necesitas más información o ayuda adicional?'
      ].join('\n'),
      { delay: 1000 }
    )

const registerFlow = addKeyword<Provider, Database>(utils.setEvent('REGISTER_FLOW'))
    .addAnswer(`What is your name?`, { capture: true }, async (ctx, { state }) => {
        await state.update({ name: ctx.body })
    })
    .addAnswer('What is your age?', { capture: true }, async (ctx, { state }) => {
        await state.update({ age: ctx.body })
    })
    .addAction(async (_, { flowDynamic, state }) => {
        await flowDynamic(`${state.get('name')}, thanks for your information!: Your age: ${state.get('age')}`)
    })

const fullSamplesFlow = addKeyword<Provider, Database>(['samples', utils.setEvent('SAMPLES')])
    .addAnswer(`💪 I'll send you a lot files...`)
    .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'sample.png') })
    .addAnswer(`Send video from URL`, {
        media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4',
    })
    .addAnswer(`Send audio from URL`, { media: 'https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3' })
    .addAnswer(`Send file from URL`, {
        media: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    })


const main = async () => {
    const adapterFlow = createFlow([welcomeFlow, registerFlow, fullSamplesFlow])
    
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })


    /*
        http://194.163.164.242:3002/v1/messages
        {
            "number":"18296370808",
            "message":"Hola Sr. Buroni usted tiene un balance de 5,871.00, favor pagar cuanto antes o envite recorgos"
        }
    */
    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )


    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
