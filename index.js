const { app } = require("./bin/Routes");
const schedule = require("node-schedule");
const express = require("express");
const nodemailer = require("nodemailer");
const Log = require("./bin/models/Log");
const Exercise = require("./bin/models/Exercise");
const People = require("./bin/models/People");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ggaleanoguerra@gmail.com",
    pass: "bqvzvtjedqktnbvx"
  }
});

const PORT = process.env.PORT || 3001;

async function sendEmail(from, to, subject, text, appName) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `"${appName}" <${from}>`,
      to: to,
      subject: subject,
      text: text
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject({ code: 500, error: error.toString() });
      } else {
        resolve({ code: 200, info: info.response });
      }
    });
  });
}

async function sendSMS(body, from, to) {
  const accountSid = "AC0908f3a9fda5f7537ab46c8e160f4f1d";
  const authToken = "7e8366371b0cdd67928ec1e862b7dc16";
  const twilio = require("twilio")(accountSid, authToken);

  try {
    const message = await twilio.messages.create({
      body: body,
      from: from,
      to: to
    });
    console.log(message.sid);
    console.log("SMS enviado correctamente");
  } catch (error) {
    console.error(error);
    console.log("Error al enviar SMS");
  }
}

const job = schedule.scheduleJob("*/1 * * * *", async () => {
  try {
    const exercises = await Exercise.find();

    for (const ejercicio of exercises) {
      const { deliveryDateFinal, Course, task_status, enviados } = ejercicio;

      const MONDA = new Set(); 
      const chachu = enviados[0]?.trabajos[0]?.people_id;
      MONDA.add(chachu);

      console.log("task_status", task_status);
      const currentDate = new Date();
      const gaver = new Date();
      gaver.setDate(currentDate.getDate() + 30);

      if (
        deliveryDateFinal <= gaver &&
        task_status == "653f0a51777e847360caeb57b"
      ) {
        console.log("Aqui deberia mandar");

        const estudiantes = await People.find();
        const estudiantesFiltrados = [];


        // console.log("estudiantes", estudiantes);

        for (const estudiante of estudiantes) {
          estudiante.course.forEach((curso) => {
            if (curso && curso._id && Course) {
              if (curso._id.toString() === Course.toString()) {
                estudiantesFiltrados.push(estudiante);
              }
            }
          });
        }
        console.log("estudiantesFiltrados", estudiantesFiltrados);

        const estudiantesSeleccionados = estudiantesFiltrados.filter(estudiante => !MONDA.has(estudiante._id));
        console.log("estudiantesSeleccionados", estudiantesSeleccionados);


        const paranotificar = estudiantesSeleccionados.map((estudiante) => ({
          nameAcudiente: estudiante.nameAcudiente,
          apellidoAcudiente: estudiante.apellidoAcudiente,
          Direccion: estudiante.Direccion,
          emailAcudiente: estudiante.emailAcudiente,
          CelularAcudiente: estudiante.CelularAcudiente,
          id: estudiante._id
        }));

        for (const notificacion of paranotificar) {
          const fromEmail = "notificacionessmarlearn@gmail.com";
          const toEmail = notificacion.emailAcudiente;
          const emailSubject = "Recordatorio de actividad";
          const emailText =
            "Hola, esta es una notificación automática que le recuerda que el alumno del cual es acudiente tiene actividades pendientes.";
          const appName = "SmartLearn";
          const accountSid = "AC0908f3a9fda5f7537ab46c8e160f4f1d";
          const authToken = "7e8366371b0cdd67928ec1e862b7dc16";
          const twilio = require("twilio")(accountSid, authToken);
          const fromSMS = "+19156007324";
          const toSMS = notificacion.CelularAcudiente;
          const smsBody =
            "Hola, esta es una notificación automática que le recuerda que el alumno del cual es acudiente tiene actividades pendientes.";

          try {
            const emailResult = await sendEmail(
              fromEmail,
              toEmail,
              emailSubject,
              emailText,
              appName
            );
            console.log(
              `Correo electrónico enviado a ${toEmail}. Código HTTP: ${emailResult.code}`
            );

            const emailLog = new Log({
              receptor: toEmail,
              fecha: new Date(),
              statusHttp: emailResult.code.toString(),
              detalles: "Envío exitoso por correo"
            });
            await emailLog.save();

            await twilio.messages.create({
              body: smsBody,
              from: fromSMS,
              to: toSMS
            });
            const smsLog = new Log({
              receptor: toSMS,
              fecha: new Date(),
              detalles: "Envío exitoso por SMS"
            });
            await smsLog.save();
          } catch (error) {
            console.error(
              `Error al enviar notificación a ${toSMS}. Detalles: ${error.toString()}`
            );

            const errorLog = new Log({
              receptor: toEmail,
              fecha: new Date(),
              detalles: `Error en notificación: ${error.toString()}`
            });
            await errorLog.save();
          }
        }
      }
    }
  } catch (error) {
    console.log("Error general", error);
  }
});

app.listen(PORT, () => {
  console.log("server on ", PORT);
});
