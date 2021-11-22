/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTransport, Transporter } from 'nodemailer';
import config = require('../../../config');
import { MailData, SendEmailResult, UserManagementMailerImplementation } from './Interfaces';

export class NodeMailer implements UserManagementMailerImplementation {
	private transport: Transporter;

	constructor() {
		this.transport = createTransport({
			host: config.get('userManagement.emails.smtp.host'),
			port: config.get('userManagement.emails.smtp.port'),
			secure: config.get('userManagement.emails.smtp.secure'),
			auth: {
				user: config.get('userManagement.emails.smtp.auth.user'),
				pass: config.get('userManagement.emails.smtp.auth.pass'),
			},
		});
	}

	async sendMail(mailData: MailData): Promise<SendEmailResult> {
		try {
			await this.transport.sendMail({
				from: config.get('userManagement.emails.smtp.sender'),
				to: mailData.emailRecipients,
				subject: mailData.subject,
				text: mailData.textOnly,
				html: mailData.body,
			});
		} catch (error) {
			return {
				success: false,
				error,
			};
		}

		return { success: true };
	}
}
