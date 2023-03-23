import sgMail from '@sendgrid/mail';

interface email {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
}

export const sendMail = async (email: email) => {

    if(!process.env.SENDGRID_API_KEY) {
        return {
            status: 404,
            message: "SENDGRID_API_KEY is not defined",
            success: false
        }
    }

    try {
        const msg = {
            from: email.from || 'florentin.greneche@gmail.com',
            to: email.to || 'onyxx61@gmail.com',
            subject: email.subject || 'Sujet par défaut',
            text: email.text || 'Ceci est un message par défaut.',
            html: email.html || '<p>Ceci est un message par défaut.</p>',
        };

        console.log(msg)

        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

        await sgMail.send(msg);

        return {
            status: 200,
            message: "Email send with success !",
            success: true
        }
    } catch (error) {
        return {
            status: 500,
            message: "A server error is come in !",
            success: false
        }
    }
}