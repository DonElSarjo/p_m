USE project_management;#NQ
-- Mehr Benutzer für die Users-Tabelle
INSERT INTO `users` (`username`, `email`) VALUES
('alice_dev', 'alice@example.com'),
('bob_admin', 'bob@example.com'),
('charlie_pm', 'charlie@example.com'),
('david_dev', 'david@example.com'),
('emma_manager', 'emma@example.com'),
('frank_data', 'frank@example.com'),
('george_admin', 'george@example.com'),
('hannah_pm', 'hannah@example.com'),
('isabel_designer', 'isabel@example.com'),
('jack_engineer', 'jack@example.com'),
('kate_research', 'kate@example.com'),
('leo_marketing', 'leo@example.com'),
('mia_qa', 'mia@example.com'),
('noah_devops', 'noah@example.com'),
('olivia_support', 'olivia@example.com'),
('peter_finance', 'peter@example.com'),
('quinn_hr', 'quinn@example.com'),
('rachel_sales', 'rachel@example.com'),
('sam_product', 'sam@example.com'),
('tina_architect', 'tina@example.com'),
('ursula_security', 'ursula@example.com'),
('victor_sysadmin', 'victor@example.com'),
('wendy_hr', 'wendy@example.com');
#NQ
-- Mehr Projekte für die Projects-Tabelle
INSERT INTO `projects` (`project_desc`, `project_owner_id`) VALUES
('Entwicklung einer neuen Web-App', 1),
('Internes Verwaltungssystem', 2),
('KI-Modell Training', 3),
('Neues Kundenportal für Bestellungen', 4),
('CRM-System-Upgrade', 5),
('Datenanalyse für Marktprognosen', 6),
('Security Audit für Cloud-Infrastruktur', 7),
('UX/UI Redesign für Webshop', 8),
('Automatisierung von Infrastruktur-Deployments', 9),
('SEO-Optimierung für Unternehmensseite', 10),
('Testing-Framework für QA-Prozesse', 11),
('Support-Chatbot mit KI', 12),
('Finanzberichtsanalyse mit Machine Learning', 13),
('Recruiting-Software-Optimierung', 14),
('Lead-Generierung durch Social Media', 15),
('Feature-Entwicklung für SaaS-Plattform', 16),
('Architektur für Microservices definieren', 17),
('Sicherheitsrichtlinien für Web-Applikationen', 18),
('Netzwerk-Optimierung in Rechenzentren', 19),
('Onboarding-Portal für neue Mitarbeiter', 20);
#NQ
-- Mehr Tasks für die Tasks-Tabelle
INSERT INTO `tasks` (`task_desc`, `task_owner_id`, `project_id`) VALUES
('Frontend für die Web-App entwickeln', 1, 1),
('Backend API für die Web-App erstellen', 1, 1),
('Datenbank-Optimierung für Verwaltungssystem', 2, 2),
('Bugfixing im Verwaltungssystem', 2, 2),
('Hyperparameter-Tuning für das KI-Modell', 3, 3),
('Datensammlung und Bereinigung', 3, 3),
('Login-Funktionalität entwickeln', 4, 4),
('Datenbankmigration auf neue Version', 5, 5),
('Machine-Learning-Modelle trainieren', 6, 6),
('Penetration Testing durchführen', 7, 7),
('Neues Design für Checkout-Seite erstellen', 8, 8),
('CI/CD-Pipeline optimieren', 9, 9),
('Keyword-Analyse für SEO-Strategie', 10, 10),
('Automatisierte Testfälle schreiben', 11, 11),
('Intent-Analyse für Chatbot-Interaktionen', 12, 12),
('Statistische Modelle für Finanzprognosen', 13, 13),
('Integration von Bewerbermanagement-Tool', 14, 14),
('Erstellung von Social-Media-Kampagnen', 15, 15),
('Datenbankmodellierung für neues Feature', 16, 16),
('Event-Streaming mit Kafka einführen', 17, 17),
('Sicherheitsrichtlinien für API-Endpunkte', 18, 18),
('Netzwerk-Bandbreitenanalyse durchführen', 19, 19),
('Einführung von Schulungsmodulen im Onboarding-Portal', 20, 20),
('Frontend-Optimierung für Performance', 4, 4),
('Benutzerfreundlichkeit des Dashboards verbessern', 5, 5),
('Daten-Cleaning für ML-Pipeline', 6, 6),
('Sicherheitslücken in Cloud-Diensten identifizieren', 7, 7),
('Farbschema für neues UI-Design definieren', 8, 8),
('Monitoring für Kubernetes Cluster implementieren', 9, 9),
('Backlink-Analyse für bessere Google-Rankings', 10, 10),
('Regressionstests für neue Features schreiben', 11, 11),
('Natural Language Processing für Chatbot verbessern', 12, 12),
('Erstellung von Forecasting-Dashboards', 13, 13),
('Optimierung der Recruiting-Pipeline', 14, 14);