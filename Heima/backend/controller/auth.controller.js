/**
 *  Controller fuer die Auth-Route liefert die Methoden um JWT-Tokens zu ueberpruefen
 * 	und neue anzufordern
 */

'use strict';
const jwt = require('jsonwebtoken')
let refreshTokens = []

/**
 *  Der durch die Cookies gegebene access JWT wird ueberprueft und 
 * 	bei Korrektheit wird die zugehoerige UserID zurueckgegeben
 */
exports.authenticateToken = function(req, res) {
	let accessToken = req.cookies.accessToken

	if (accessToken == null) return res.sendStatus(401)

	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, userid) => {
		if (err) return res.sendStatus(403)
		if (isNaN(userid.userid.userid)) return res.status(200).send(userid.userid)
		return res.status(200).send(userid.userid.userid)
	})
	
}

/**
 *  Der durch die Cookies gegebene refresh JWT wird ueberprueft und 
 * 	bei Korrektheit als ungueltig erklaert
 */
exports.deauthenticateToken = function(req, res) {
	let refreshToken = req.cookies.refreshToken

	if (refreshToken == null) return res.sendStatus(401)

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userid) => {
		if (err) return res.sendStatus(403)
		refreshTokens = refreshTokens.filter(token => token !== refreshToken)
		return res.status(200).send("RefreshToken for UserID" + userid + "was deauthenticated.")
	})
}

/**
 *  Zur im Request befindlichen UserID werden zwei JWT-Tokens (access und refresh) 
 * 	erstellt und zurueckgegeben
 */
exports.getTokens = function(req, res) {
	const userid = req.params.userId;
	if (!userid) {
		// 400 = bad request
		return res.status(400).send('The required path variable userId is missing')
	}

	const accessToken = jwt.sign({userid}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
	const refreshToken = jwt.sign({userid}, process.env.REFRESH_TOKEN_SECRET)

	// Speichere erstellten refreshToken ab, um ihn spaeter als 'aktiv' wiederzuerkennen
	refreshTokens.push(refreshToken)

	res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 600000 });
	res.cookie('refreshToken', refreshToken, { httpOnly: true });
	return res.status(200).send('AccessToken and RefreshToken were sent.')

}

/**
 *  Zum im Request befindlichen RefreshToken wird ein neuer JWT-Token (access) 
 * 	erstellt und zurueckgegeben
 */
exports.getNewAccessToken = function(req, res) {
	let refreshToken = req.cookies.refreshToken
	if (!refreshToken) {
		// 400 = bad request
		return res.status(400).send('The required path variable refreshToken is missing')
	}
	if (!refreshTokens.includes(refreshToken)) {
		return res.status(403).send('This token is invalid')
	}
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userid) => {
		if (err) return res.sendStatus(403)
		const accessToken = jwt.sign({userid}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
		res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 600000 });
		return res.status(200).send('New AccessToken was sent')
	})


}

