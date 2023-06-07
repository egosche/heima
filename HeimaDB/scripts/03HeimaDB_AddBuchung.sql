USE heimadb;
INSERT INTO buchung (BuchungID, ErstellerIDfk, ZimmerIDfk, Status, Anfang, Ende, Buchungszeitpunkt, PreisproNacht) VALUES
	(1, 2, 1, 'ausstehend', '2021-12-01 00:00:00', '2021-12-15 00:00:00', '2021-01-14 00:00:00', 120.00),
    (2, 2, 2, 'ausstehend', '2021-06-18 00:00:00', '2021-06-20 00:00:00', '2021-01-14 00:00:00', 90.00),
    (3, 2, 2, 'akzeptiert', '2021-01-01 00:00:00', '2021-01-10 00:00:00', '2021-01-01 00:00:00', 90.00);
    
    
INSERT INTO zusatzleistung_buchung (ZusatzleistungBuchungID, ZusatzleistungIDfk, BuchungIDfk) VALUES
	(1, 1, 1),
    (2, 2, 1),
    (3, 3, 2),
    (4, 1, 3);