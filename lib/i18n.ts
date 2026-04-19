export type Lang = 'ru' | 'kz' | 'en'

const translations = {
	ru: {
		nav: {
			features: 'Возможности',
			howItWorks: 'Как это работает',
			cases: 'Кейсы',
			pricing: 'Цены',
			login: 'Войти',
			cta: 'Начать бесплатно'
		},
		hero: {
			badge: 'Юридический ИИ, адаптированный под законы РК',
			title1: 'Создавайте договоры',
			title2: 'силой интеллекта',
			subtitle:
				'Мгновенная генерация юридически безупречных документов. Экономьте время и бюджет на юристов, не рискуя безопасностью бизнеса.',
			createContract: 'Создать договор',
			watchDemo: 'Смотреть демо',
			trustedBy: 'Доверяют:'
		},
		trust: {
			title: 'Доверие лидеров рынка Казахстана',
			subtitle:
				'0 компаний уже автоматизировали свою юридическую работу с Контрактум.'
		},
		features: {
			sectionTitle: 'Все, что нужно для современной юриспруденции',
			sectionSubtitle:
				'Мы объединили передовой ИИ с глубоким пониманием локального права, чтобы вы могли сфокусироваться на росте бизнеса.',
			allFeatures: 'Все возможности',
			items: [
				{
					title: 'Генератор на базе ИИ',
					description:
						'Наш ИИ понимает контекст вашего бизнеса и создает точные формулировки за считанные секунды.'
				},
				{
					title: 'Законодательство РК',
					description:
						'Каждый документ проверяется на соответствие актуальным кодексам и законам Республики Казахстан.'
				},
				{
					title: 'Мультиязычность',
					description:
						'Договоры на казахском, русском и английском языках с идеальной юридической терминологией.'
				},
				{
					title: 'Командная работа',
					description:
						'Приглашайте коллег для совместного редактирования и согласования документов.'
				}
				// {
				// 	title: 'Безопасное облако',
				// 	description:
				// 		'Ваши данные зашифрованы и хранятся на защищенных серверах с многоуровневым доступом.'
				// }
			]
		},
		preview: {
			label: 'Интерфейс',
			title: 'Профессиональное рабочее пространство',
			subtitle:
				'Управляйте всем юридическим циклом в одном месте. От генерации до подписания и хранения — Контрактум предлагает чистый, интуитивно понятный интерфейс, созданный для эффективности бизнеса.',
			points: [
				'Автозаполнение форм на основе данных компании',
				'Юридические подсказки ИИ в реальном времени',
				'Контроль версий и история изменений'
				// 'Интегрированная поддержка ЭЦП'
			],
			cta: 'Попробовать рабочую область',
			aiTag: 'Рекомендация ИИ',
			aiText:
				'«Пункт 4.2 следует дополнить положением о форс-мажоре для лучшей защиты интересов сторон».'
		},
		heroInteractive: {
			title: 'Новый договор услуг',
			subtitle: 'Заполните поля — ИИ проверит всё за вас',
			progress: 'Прогресс',
			fields: [
				{ label: 'Клиент', value: 'ТОО «Алматы Строй»' },
				{ label: 'Сумма договора', value: '2 500 000 ₸' },
				{ label: 'Срок исполнения', value: '31.12.2026' }
			],
			aiCheck: 'ИИ проверяет соответствие ГК РК 2026...',
			generateBtn: 'Сгенерировать PDF',
			notifTitle: 'PDF готов!',
			notifFile: 'Договор_001.pdf · 48 КБ'
		},
		dashboardInteractive: {
			windowTitle: 'Контрактум · Мои договоры',
			statContracts: 'Договоров',
			statAvgTime: 'Ср. время',
			statCompliance: 'Соответствие РК',
			contracts: [
				{ name: 'Договор аренды №4', date: '05.03.2026' },
				{ name: 'Договор услуг №12', date: '04.03.2026' },
				{ name: 'Купля-продажа №7', date: '06.03.2026' }
			],
			statusDone: 'Готов',
			statusLive: 'Создаётся...',
			lastUpdated: 'Последнее обновление: только что',
			createNew: 'Создать новый'
		},
		animatedMetric: {
			avgTime: 'среднее время создания',
			bars: [
				{ label: 'Договор услуг', w: 95 },
				{ label: 'Аренда', w: 88 },
				{ label: 'Купля-продажа', w: 80 }
			]
		},
		howItWorks: {
			label: 'Процесс',
			title1: 'От идеи до договора',
			title2: 'в 3 простых шага',
			subtitle:
				'Мы превратили сложный юридический процесс в интуитивно понятный цифровой опыт.',
			cta: 'Начать сейчас',
			users: '+0',
			steps: [
				{
					number: '01',
					title: 'Выберите тип договора',
					description:
						'Используйте библиотеку из 100+ шаблонов или опишите задачу ИИ своими словами.'
				},
				{
					number: '02',
					title: 'Ответьте на вопросы ИИ',
					description:
						'Ассистент уточнит детали сделки, чтобы документ полностью защищал ваши интересы.'
				},
				{
					number: '03',
					title: 'Получите готовый документ',
					description:
						'Скачивайте юридически значимый договор в PDF или Word за считанные секунды.'
				}
			]
		},
		useCases: {
			title: 'Создано для любого этапа бизнеса',
			subtitle:
				'Контрактум адаптируется под ваши масштабы — от первого контракта до корпоративного управления.',
			items: [
				{
					title: 'Стартапы',
					desc: 'Учредительные договоры, передача ИС, опционы и NDA для инвесторов.'
				},
				{
					title: 'Малый бизнес',
					desc: 'Трудовые договоры, аренда офиса и договоры с поставщиками услуг.'
				},
				{
					title: 'Фрилансеры',
					desc: 'Договоры на оказание услуг, защита оплаты и авторских прав.'
				},
				{
					title: 'Корпорации',
					desc: 'Комплаенс-аудит, массовая генерация типовых договоров и API.'
				}
			]
		},
		pricing: {
			title: 'Простые и прозрачные тарифы',
			subtitle: 'Выберите план, который подходит вашему бизнесу.',
			popular: 'Популярный выбор',
			perMonth: '/мес',
			tiers: [
				{
					name: 'Старт',
					price: '0',
					description: 'Для фрилансеров и индивидуальных предпринимателей.',
					features: [
						'3 договора в месяц',
						'Стандартные шаблоны',
						'Экспорт в PDF',
						'Базовая поддержка'
					],
					cta: 'Начать бесплатно',
					popular: false
				},
				{
					name: 'Профи',
					price: '15,000',
					description: 'Для растущих стартапов и малого бизнеса.',
					features: [
						'Безлимитные договоры',
						'Кастомная генерация ИИ',
						'Команда (до 5 чел)',
						'Word и PDF экспорт',
						'Приоритетная поддержка'
					],
					cta: 'Попробовать бесплатно',
					popular: true
				},
				{
					name: 'Бизнес',
					price: 'Индивидуально',
					description: 'Для крупных компаний и юр. департаментов.',
					features: [
						'Все возможности Профи',
						'Доступ к API',
						'Обучение ИИ на ваших данных',
						'Персональный менеджер',
						'SSO и расширенная защита'
					],
					cta: 'Связаться с нами',
					popular: false
				}
			]
		},
		cta: {
			title1: 'Создавайте безопасные',
			title2: 'договоры уже сегодня',
			subtitle:
				'Присоединяйтесь к 0 компаний в Казахстане, которые автоматизировали свою юридическую работу. Начните бесплатно прямо сейчас.',
			primary: 'Начать бесплатно',
			secondary: 'Связаться с отделом продаж',
			badge1: 'Безопасно по ГК РК',
			badge2: 'Шифрование данных',
			badge3: 'Поддержка 24/7'
		},
		footer: {
			tagline:
				'Развиваем бизнес в Казахстане с помощью юридических решений на базе ИИ. Быстро, безопасно, законно.',
			product: 'Продукт',
			company: 'Компания',
			newsletter: 'Подписка на новости',
			newsletterText:
				'Получайте обновления о законодательстве РК и новых функциях.',
			emailPlaceholder: 'Email',
			copyright: '© 2026 Контрактум. Все права защищены. Сделано в Казахстане.',
			secureConnection: 'Безопасное соединение',
			// productLinks: ['Возможности', 'Шаблоны', 'ИИ Ассистент', 'Цены'],
			productLinks: ['Возможности', 'Шаблоны', 'ИИ Ассистент'],
			companyLinks: ['О нас', 'Карьера', 'Блог', 'Контакты']
		},
		login: {
			decorTitle: 'Юридические документы нового поколения',
			decorSubtitle:
				'Создавайте договоры по законодательству РК за считанные минуты с помощью ИИ.',
			decorUsers: '0 компаний уже с нами',
			title: 'С возвращением',
			noAccount: 'Нет аккаунта?',
			registerLink: 'Зарегистрироваться',
			emailLabel: 'Email',
			emailPlaceholder: 'you@company.kz',
			passwordLabel: 'Пароль',
			passwordPlaceholder: '••••••••',
			submit: 'Войти',
			submitting: 'Входим...',
			errorDefault: 'Неверный email или пароль'
		},
		register: {
			decorTitle: 'Начните создавать договоры бесплатно',
			decorSubtitle:
				'3 договора в месяц без ограничений. Никаких карт, никаких скрытых платежей.',
			decorFeatures: [
				'3 бесплатных договора',
				'PDF экспорт',
				'Закон РК 2026',
				'Мгновенная генерация'
			],
			title: 'Создать аккаунт',
			hasAccount: 'Уже есть аккаунт?',
			loginLink: 'Войти',
			nameLabel: 'Имя',
			namePlaceholder: 'Ерсултан Макишев',
			emailLabel: 'Email',
			emailPlaceholder: 'you@company.kz',
			passwordLabel: 'Пароль',
			passwordHint: '(мин. 8 символов)',
			passwordPlaceholder: '••••••••',
			submit: 'Начать бесплатно',
			submitting: 'Создаём аккаунт...',
			errorDefault: 'Ошибка при регистрации'
		},
		dashboard: {
			mainMenu: 'Главное меню',
			panel: 'Панель',
			myContracts: 'Мои договоры',
			newContract: 'Новый договор',
			team: 'Команда',
			settingsGroup: 'Настройки',
			settings: 'Настройки',
			account: 'Аккаунт',
			help: 'Помощь',
			tariffStart: 'Тариф Старт',
			adminRole: 'Администратор',
			searchPlaceholder: 'Поиск договоров...',
			greeting: 'С возвращением,',
			greetingSubtitle: 'Вот что происходит с вашими документами.',
			greetingTime: {
				morning: 'Доброе утро,',
				afternoon: 'Добрый день,',
				evening: 'Добрый вечер,'
			},
			allTime: 'Все время',
			stats: {
				total: 'Все договоры',
				totalSub: 'всего',
				draft: 'Черновики',
				draftSub: 'ожидают заполнения',
				generated: 'Готовы',
				generatedSub: 'PDF доступны',
				statLabel: 'Статистика'
			},
			table: {
				title: 'Мои договоры',
				create: 'Создать',
				loading: 'Загрузка...',
				emptySearch: 'Договоры не найдены',
				empty: 'У вас пока нет договоров',
				emptySubtitle: 'Создайте первый договор — это займёт меньше минуты.',
				createFirst: 'Создать первый договор',
				colName: 'Название',
				colDate: 'Дата',
				colStatus: 'Статус',
				colActions: 'Действия',
				showAll: 'Показать все'
			},
			quickActions: {
				createTitle: 'Создать договор',
				createDesc:
					'Выберите шаблон, заполните форму и получите готовый PDF за считанные секунды.',
				createBtn: 'Начать',
				templatesTitle: 'Шаблоны договоров',
				templatesDesc:
					'Услуги, аренда и купля-продажа — по законодательству РК.',
				templatesBtn: 'Выбрать',
				templateNames: ['Услуги', 'Аренда', 'Продажа']
			}
		},
		status: {
			generated: 'Готов',
			draft: 'Черновик',
			failed: 'Ошибка'
		},
		newContract: {
			back: 'Назад к выбору',
			backDashboard: 'Dashboard',
			pageTitle: 'Новый договор',
			step1Label: 'Тип',
			step2Label: 'Данные',
			step3Label: 'Готово',
			selectTitle: 'Выберите тип договора',
			selectSubtitle: 'Все шаблоны соответствуют законодательству РК.',
			loadingTemplates: 'Загрузка шаблонов...',
			fillTitle: 'Заполните форму',
			fillSubtitle: 'Заполните все поля — они будут вставлены в договор.',
			titleLabel: 'Название договора',
			required: '*',
			submitBtn: 'Создать договор',
			submitting: 'Генерируем PDF...',
			doneTitle: 'Договор создан!',
			doneSubtitle: 'PDF готов для скачивания.',
			openContract: 'Открыть договор',
			toList: 'К списку',
			createMore: 'Создать ещё',
			profileSelector: 'Профиль автозаполнения',
			profileSelectorPlaceholder: 'Выберите профиль для автозаполнения',
			fillFromProfile: 'Заполнить из профиля',
			noProfiles: 'Нет профилей',
			manageProfiles: 'Настройки',
			hintTitle: 'Сэкономьте время',
			hintMessage:
				'Сохраните свои данные в Настройках, чтобы быстро заполнять будущие договоры.',
			hintGoSettings: 'Перейти в Настройки',
			hintDismiss: 'Понятно'
		},
		contractDetail: {
			back: 'Назад',
			pageTitle: 'Договор',
			downloadPDF: 'Скачать PDF',
			loading: 'Загрузка...',
			created: 'Создан:'
		},
		common: {
			delete: 'Удалить',
			deleteConfirm: 'Удалить договор?',
			download: 'Скачать PDF',
			language: 'Язык',
			appName: 'Контрактум',
			appInitial: 'К'
		},
		settings: {
			pageTitle: 'Настройки аккаунта',
			pageSubtitle: 'Управляйте своим профилем и настройками безопасности',
			profileSection: 'Профиль',
			profileDesc: 'Обновите свое имя и контактную информацию',
			nameLabel: 'Полное имя',
			namePlaceholder: 'Макишев Ерсултан',
			emailLabel: 'Email',
			emailDisabled: 'Email нельзя изменить',
			saveProfile: 'Сохранить изменения',
			savingProfile: 'Сохраняем...',
			profileSuccess: 'Профиль успешно обновлен',
			securitySection: 'Безопасность',
			securityDesc: 'Измените свой пароль',
			currentPasswordLabel: 'Текущий пароль',
			currentPasswordPlaceholder: 'Введите текущий пароль',
			newPasswordLabel: 'Новый пароль',
			newPasswordPlaceholder: 'Минимум 8 символов',
			changePassword: 'Изменить пароль',
			changingPassword: 'Изменяем...',
			passwordSuccess: 'Пароль успешно изменен',
			profiles: {
				sectionTitle: 'Профили автозаполнения',
				sectionDesc: 'Сохраните данные для быстрого заполнения форм договоров',
				addProfile: 'Добавить профиль',
				editProfile: 'Редактировать',
				deleteProfile: 'Удалить',
				deleteConfirm: 'Удалить профиль?',
				saveBtn: 'Сохранить',
				cancelBtn: 'Отмена',
				labelLabel: 'Название профиля',
				labelPlaceholder: 'Например: Моя компания',
				typeLabel: 'Тип',
				typeIndividual: 'Физическое лицо',
				typeLegal: 'Юридическое лицо',
				fieldIIN: 'ИИН',
				fieldBIN: 'БИН',
				fieldFullName: 'ФИО',
				fieldCompanyName: 'Наименование организации',
				fieldLegalAddress: 'Юридический адрес',
				fieldActualAddress: 'Фактический адрес',
				fieldPhone: 'Телефон',
				fieldEmail: 'Email',
				fieldIBAN: 'IBAN',
				fieldBIK: 'БИК',
				noProfiles: 'Нет сохраненных профилей',
				individual: 'Физ. лицо',
				legalEntity: 'Юр. лицо',
				createSuccess: 'Профиль создан',
				updateSuccess: 'Профиль обновлён',
				deleteSuccess: 'Профиль удалён'
			}
		},
		team: {
			pageTitle: 'Команда',
			pageSubtitle: 'Совместная работа над договорами скоро будет доступна',
			comingSoon: 'Скоро',
			comingSoonDesc:
				'Мы работаем над функцией командной работы. Пригласите коллег, назначайте роли и согласовывайте документы вместе.',
			feature1Title: 'Приглашение участников',
			feature1Desc:
				'Добавляйте коллег и назначайте роли: просмотр, редактирование или администрирование.',
			feature2Title: 'Совместное редактирование',
			feature2Desc:
				'Работайте над договорами одновременно с возможностью оставлять комментарии.',
			feature3Title: 'Согласование документов',
			feature3Desc:
				'Настройте цепочку согласования и отслеживайте статус утверждения.',
			notifyBtn: 'Уведомить меня',
			notifyPlaceholder: 'Ваш email',
			notifySuccess: 'Вы будете первым в курсе!'
		},
		help: {
			pageTitle: 'Помощь и поддержка',
			pageSubtitle: 'Найдите ответы на часто задаваемые вопросы',
			searchPlaceholder: 'Поиск по вопросам...',
			faqTitle: 'Часто задаваемые вопросы',
			contactTitle: 'Связаться с поддержкой',
			contactDesc:
				'Не нашли ответ? Напишите нам — мы ответим в течение 24 часов.',
			contactBtn: 'Написать в поддержку',
			contactEmail: 'support@contractum.kz',
			docsTitle: 'Документация',
			docsDesc: 'Подробные руководства по использованию платформы.',
			docsBtn: 'Открыть документацию',
			faqItems: [
				{
					q: 'Как создать первый договор?',
					a: 'Нажмите «Новый договор» на панели управления, выберите тип шаблона, заполните форму и получите готовый PDF.'
				},
				{
					q: 'Можно ли редактировать уже созданный договор?',
					a: 'Да. Откройте договор и нажмите кнопку «Редактировать». После сохранения PDF будет сгенерирован заново.'
				},
				{
					q: 'Как скачать PDF?',
					a: 'На странице договора или в таблице на панели управления нажмите иконку скачивания.'
				},
				{
					q: 'Соответствуют ли договоры законодательству РК?',
					a: 'Да. Все шаблоны разработаны с учётом актуального гражданского и трудового законодательства Республики Казахстан.'
				},
				{
					q: 'Как изменить пароль?',
					a: 'Перейдите в «Настройки» → раздел «Безопасность», введите текущий и новый пароль.'
				},
				{
					q: 'Можно ли удалить договор?',
					a: 'Да. В таблице договоров нажмите иконку корзины. Удаление необратимо.'
				}
			]
		},
		contracts: {
			pageTitle: 'Мои договоры',
			pageSubtitle: 'Все ваши договоры в одном месте',
			newContract: 'Новый договор'
		},
		admin: {
			pageTitle: 'Панель администратора',
			tabUsers: 'Пользователи',
			tabContracts: 'Все договоры',
			tabTemplates: 'Шаблоны',
			tabFunnel: 'Воронка',
			accessDenied: 'Доступ запрещён',
			// Users tab
			usersTitle: 'Пользователи',
			colEmail: 'Email',
			colName: 'Имя',
			colRole: 'Роль',
			colStatus: 'Статус',
			colJoined: 'Дата регистрации',
			roleAdmin: 'Администратор',
			roleUser: 'Пользователь',
			statusActive: 'Активен',
			statusInactive: 'Неактивен',
			// Contracts tab
			contractsTitle: 'Все договоры',
			filterByStatus: 'Все статусы',
			colTitle: 'Название',
			colUser: 'Пользователь',
			colTemplate: 'Шаблон',
			colDate: 'Дата',
			colActions: 'Действия',
			downloadPDF: 'Скачать PDF',
			prevPage: 'Назад',
			nextPage: 'Вперёд',
			pageOf: 'Страница',
			of: 'из',
			// Templates tab
			templatesTitle: 'Шаблоны',
			createTemplate: 'Создать шаблон',
			colType: 'Тип',
			colNameRu: 'Название (рус)',
			colVersion: 'Версия',
			colActive: 'Активен',
			editTemplate: 'Редактировать',
			deleteTemplate: 'Удалить',
			deleteConfirmTitle: 'Удалить шаблон?',
			deleteConfirmMessage:
				'Это действие необратимо. Шаблон будет удалён навсегда.',
			confirmDelete: 'Удалить',
			confirmCancel: 'Отмена',
			deleteSuccess: 'Шаблон удалён',
			deleteError: 'Не удалось удалить шаблон',
			toggleSuccess: 'Статус шаблона обновлён',
			toggleError: 'Не удалось обновить статус',
			// Template editor modal
			editorCreateTitle: 'Создать шаблон',
			editorEditTitle: 'Редактировать шаблон',
			fieldType: 'Тип (идентификатор)',
			fieldTypePlaceholder: 'service, lease, sale...',
			fieldNameRu: 'Название (рус)',
			fieldNameRuPlaceholder: 'Договор оказания услуг',
			fieldNameKz: 'Название (каз)',
			fieldNameKzPlaceholder: 'Қызмет шарты',
			fieldHtmlBody: 'HTML-шаблон',
			fieldHtmlBodyPlaceholder:
				'<html>...</html>  Используйте {{.FieldName}} для полей',
			fieldSchema: 'Схема полей (JSON)',
			fieldSchemaPlaceholder:
				'{"fields":[{"name":"ClientName","label":"Имя клиента","type":"text","required":true}]}',
			previewTitle: 'Предпросмотр',
			saveBtn: 'Сохранить',
			saving: 'Сохранение...',
			cancelBtn: 'Отмена',
			schemaParseError: 'Ошибка парсинга JSON схемы',
			createSuccess: 'Шаблон создан',
			updateSuccess: 'Шаблон обновлён',
			saveError: 'Не удалось сохранить шаблон',
			loading: 'Загрузка...'
		},
		toast: {
			success: 'Успешно',
			error: 'Ошибка',
			warning: 'Предупреждение',
			info: 'Информация',
			deleteConfirmTitle: 'Удалить договор?',
			deleteConfirmMessage:
				'Это действие нельзя отменить. Договор будет удален навсегда.',
			confirmCancel: 'Отмена',
			confirmDelete: 'Удалить',
			deleteSuccess: 'Договор удален',
			deleteSuccessDesc: 'Договор был успешно удален',
			deleteError: 'Ошибка удаления',
			deleteErrorDesc: 'Не удалось удалить договор',
			contractCreated: 'Договор создан',
			contractCreatedDesc: 'PDF готов для скачивания',
			contractCreateError: 'Ошибка создания',
			profileError: 'Не удалось обновить профиль',
			passwordError: 'Не удалось изменить пароль',
			loginError: 'Вход не выполнен',
			loginSuccess: 'Вход выполнен',
			loginSuccessDesc: 'Добро пожаловать в систему',
			registerError: 'Регистрация не выполнена',
			registerSuccess: 'Аккаунт создан',
			registerSuccessDesc: 'Добро пожаловать в Контрактум',
			pdfDownloadSuccess: 'PDF скачан',
			pdfDownloadError: 'Не удалось скачать PDF'
		},
		aiAnalysis: {
			title: 'Интеллектуальный анализ',
			btnAnalyze: 'Анализировать ИИ',
			analyzing: 'Анализируем...',
			riskLevel: 'Уровень риска',
			healthScore: 'Оценка здоровья',
			summary: 'Общий вывод',
			issues: 'Выявленные риски',
			recommendations: 'Рекомендации',
			noIssues: 'Рисков не обнаружено',
			riskLevels: {
				low: 'Низкий',
				medium: 'Средний',
				high: 'Высокий',
				critical: 'Критический',
				unknown: 'Неизвестно'
			},
			categories: {
				missing_clause: 'Отсутствующий пункт',
				ambiguous_term: 'Размытая формулировка',
				illegal_term: 'Незаконное условие',
				one_sided: 'Односторонний интерес',
				missing_details: 'Недостаточно данных',
				compliance: 'Комплаенс'
			},
			steps: {
				reading: 'Читаю договор...',
				checkingNorms: 'Проверяю нормы РК...',
				identifyingRisks: 'Определяю риски...',
				generatingReport: 'Формирую отчёт...'
			},
			error: 'Не удалось выполнить анализ',
			retry: 'Повторить анализ'
		}
	},

	// ─────────────────────────────────────────────────────────────────────────────
	// KAZAKH
	// ─────────────────────────────────────────────────────────────────────────────
	kz: {
		nav: {
			features: 'Мүмкіндіктер',
			howItWorks: 'Қалай жұмыс істейді',
			cases: 'Жағдайлар',
			pricing: 'Бағалар',
			login: 'Кіру',
			cta: 'Тегін бастау'
		},
		hero: {
			badge: 'ҚР заңдарына бейімделген заңдық ЖИ',
			title1: 'Шарттарды жасаңыз',
			title2: 'интеллект күшімен',
			subtitle:
				'Заңдық тұрғыдан мінсіз құжаттарды лезде жасаңыз. Бизнес қауіпсіздігіне нұқсан келтірмей заңгерлерге жұмсалатын уақыт пен бюджетті үнемдеңіз.',
			createContract: 'Шарт жасау',
			watchDemo: 'Демоны қарау',
			trustedBy: 'Сенеді:'
		},
		trust: {
			title: 'Қазақстан нарығының көшбасшылары сенеді',
			subtitle:
				'500-ден астам компания Контрактум арқылы заңдық жұмыстарын автоматтандырды.'
		},
		features: {
			sectionTitle: 'Заманауи заңтану үшін қажеттінің бәрі',
			sectionSubtitle:
				'Бизнес өсіміне назар аударуға мүмкіндік беру үшін озық ЖИ мен жергілікті құқықты терең түсінуді біріктірдік.',
			allFeatures: 'Барлық мүмкіндіктер',
			items: [
				{
					title: 'ЖИ негізіндегі генератор',
					description:
						'ЖИ бизнес контекстіңізді түсіріп, секунд ішінде нақты тұжырымдамалар жасайды.'
				},
				{
					title: 'ҚР заңнамасы',
					description:
						'Әрбір құжат Қазақстан Республикасының қолданыстағы кодекстері мен заңдарына сәйкестігі тексеріледі.'
				},
				{
					title: 'Көптілділік',
					description:
						'Қазақ, орыс және ағылшын тілдерінде мінсіз заңдық терминологиямен шарттар.'
				},
				{
					title: 'Команда жұмысы',
					description:
						'Құжаттарды бірлесіп өңдеу және келісу үшін әріптестерді шақырыңыз.'
				},
				{
					title: 'Қауіпсіз бұлт',
					description:
						'Деректеріңіз шифрланған және көп деңгейлі қол жетімділігі бар қорғалған серверлерде сақталады.'
				}
			]
		},
		preview: {
			label: 'Интерфейс',
			title: 'Кәсіби жұмыс кеңістігі',
			subtitle:
				'Барлық заңдық циклді бір жерде басқарыңыз. Жасаудан бастап қол қоюға және сақтауға дейін — Контрактум бизнес тиімділігіне арналған таза, интуитивті интерфейс ұсынады.',
			points: [
				'Компания деректері негізінде пішіндерді автотолтыру',
				'Нақты уақытта ЖИ заңдық кеңестері',
				'Нұсқаларды бақылау және өзгерістер тарихы'
				// 'ЭЦҚ кіріктірілген қолдауы'
			],
			cta: 'Жұмыс кеңістігін сынап көру',
			aiTag: 'ЖИ ұсынысы',
			aiText:
				'«4.2-тармақты тараптардың мүдделерін жақсы қорғау үшін форс-мажор туралы ережемен толықтыру керек».'
		},
		heroInteractive: {
			title: 'Жаңа қызмет көрсету шарты',
			subtitle: 'Өрістерді толтырыңыз — ЖИ бәрін тексереді',
			progress: 'Прогресс',
			fields: [
				{ label: 'Клиент', value: 'ЖШС «Алматы Строй»' },
				{ label: 'Шарт сомасы', value: '2 500 000 ₸' },
				{ label: 'Орындау мерзімі', value: '31.12.2026' }
			],
			aiCheck: 'ЖИ ҚР АК 2026 сәйкестігін тексеруде...',
			generateBtn: 'PDF жасау',
			notifTitle: 'PDF дайын!',
			notifFile: 'Шарт_001.pdf · 48 КБ'
		},
		dashboardInteractive: {
			windowTitle: 'Контрактум · Менің шарттарым',
			statContracts: 'Шарттар',
			statAvgTime: 'Орт. уақыт',
			statCompliance: 'ҚР сәйкестігі',
			contracts: [
				{ name: 'Жалдау шарты №4', date: '05.03.2026' },
				{ name: 'Қызмет шарты №12', date: '04.03.2026' },
				{ name: 'Сатып алу-сату №7', date: '06.03.2026' }
			],
			statusDone: 'Дайын',
			statusLive: 'Жасалуда...',
			lastUpdated: 'Соңғы жаңарту: жаңа ғана',
			createNew: 'Жаңа жасау'
		},
		animatedMetric: {
			avgTime: 'орташа жасау уақыты',
			bars: [
				{ label: 'Қызмет шарты', w: 95 },
				{ label: 'Жалдау', w: 88 },
				{ label: 'Сатып алу-сату', w: 80 }
			]
		},
		howItWorks: {
			label: 'Процесс',
			title1: 'Идеядан шартқа дейін',
			title2: '3 қарапайым қадамда',
			subtitle:
				'Күрделі заңдық процесті интуитивті цифрлық тәжірибеге айналдырдық.',
			cta: 'Қазір бастау',
			users: '+2к',
			steps: [
				{
					number: '01',
					title: 'Шарт түрін таңдаңыз',
					description:
						'100+ үлгі кітапханасын пайдаланыңыз немесе тапсырманы ЖИ-ге өз сөзіңізбен сипаттаңыз.'
				},
				{
					number: '02',
					title: 'ЖИ сұрақтарына жауап беріңіз',
					description:
						'Ассистент мәміленің мәліметтерін нақтылайды, сонда құжат мүдделеріңізді толық қорғайды.'
				},
				{
					number: '03',
					title: 'Дайын құжатты алыңыз',
					description:
						'Заңдық маңызы бар шартты PDF немесе Word форматында секундтар ішінде жүктеңіз.'
				}
			]
		},
		useCases: {
			title: 'Бизнестің кез келген кезеңіне арналған',
			subtitle:
				'Контрактум сіздің масштабыңызға бейімделеді — алғашқы келісімшарттан корпоративтік басқаруға дейін.',
			items: [
				{
					title: 'Стартаптар',
					desc: 'Құрылтай шарттары, ЗМ беру, опциондар және инвесторлар үшін NDA.'
				},
				{
					title: 'Шағын бизнес',
					desc: 'Еңбек шарттары, кеңсе жалдауы және қызмет жеткізушілермен шарттар.'
				},
				{
					title: 'Фрилансерлер',
					desc: 'Қызмет көрсету шарттары, төлем мен авторлық құқықтарды қорғау.'
				},
				{
					title: 'Корпорациялар',
					desc: 'Комплаенс аудиті, типтік шарттарды жаппай жасау және API.'
				}
			]
		},
		pricing: {
			title: 'Қарапайым және ашық тарифтер',
			subtitle: 'Бизнесіңізге сәйкес жоспарды таңдаңыз.',
			popular: 'Танымал таңдау',
			perMonth: '/ай',
			tiers: [
				{
					name: 'Бастаушы',
					price: '0',
					description: 'Фрилансерлер мен жеке кәсіпкерлер үшін.',
					features: [
						'Айына 3 шарт',
						'Стандартты үлгілер',
						'PDF экспорт',
						'Негізгі қолдау'
					],
					cta: 'Тегін бастау',
					popular: false
				},
				{
					name: 'Профи',
					price: '15,000',
					description: 'Өсіп келе жатқан стартаптар мен шағын бизнес үшін.',
					features: [
						'Шексіз шарттар',
						'ЖИ арнайы генерациясы',
						'Команда (5 адамға дейін)',
						'Word және PDF экспорт',
						'Басымдықты қолдау'
					],
					cta: 'Тегін сынап көру',
					popular: true
				},
				{
					name: 'Бизнес',
					price: 'Жеке',
					description: 'Ірі компаниялар мен заңдық департаменттер үшін.',
					features: [
						'Профидің барлық мүмкіндіктері',
						'API-ге қол жеткізу',
						'Деректерде ЖИ оқыту',
						'Жеке менеджер',
						'SSO және кеңейтілген қорғаныс'
					],
					cta: 'Бізбен байланысу',
					popular: false
				}
			]
		},
		cta: {
			title1: 'Бүгін қауіпсіз',
			title2: 'шарттар жасаңыз',
			subtitle:
				'Заңдық жұмыстарын автоматтандырған Қазақстандағы 0 компанияға қосылыңыз. Қазір тегін бастаңыз.',
			primary: 'Тегін бастау',
			secondary: 'Сату бөліміне хабарласу',
			badge1: 'ҚР АК бойынша қауіпсіз',
			badge2: 'Деректерді шифрлау',
			badge3: '24/7 қолдау'
		},
		footer: {
			tagline:
				'ЖИ негізіндегі заңдық шешімдер арқылы Қазақстандағы бизнесті дамытамыз. Жылдам, қауіпсіз, заңды.',
			product: 'Өнім',
			company: 'Компания',
			newsletter: 'Жаңалықтарға жазылу',
			newsletterText:
				'ҚР заңнамасы туралы жаңартулар мен жаңа мүмкіндіктер алыңыз.',
			emailPlaceholder: 'Email',
			copyright:
				'© 2026 Контрактум. Барлық құқықтар қорғалған. Қазақстанда жасалған.',
			secureConnection: 'Қауіпсіз байланыс',
			productLinks: ['Мүмкіндіктер', 'Үлгілер', 'ЖИ Ассистент', 'Бағалар'],
			companyLinks: ['Біз туралы', 'Мансап', 'Блог', 'Байланыс']
		},
		login: {
			decorTitle: 'Жаңа буын заңдық құжаттар',
			decorSubtitle:
				'ЖИ көмегімен ҚР заңнамасына сәйкес шарттарды минуттар ішінде жасаңыз.',
			decorUsers: '5,000+ компания бізбен',
			title: 'Қайта оралдыңыз',
			noAccount: 'Аккаунтыңыз жоқ па?',
			registerLink: 'Тіркелу',
			emailLabel: 'Email',
			emailPlaceholder: 'you@company.kz',
			passwordLabel: 'Құпия сөз',
			passwordPlaceholder: '••••••••',
			submit: 'Кіру',
			submitting: 'Кіруде...',
			errorDefault: 'Email немесе құпия сөз қате'
		},
		register: {
			decorTitle: 'Шарттарды тегін жасауды бастаңыз',
			decorSubtitle: 'Айына 3 шарт шектеусіз. Карта жоқ, жасырын төлем жоқ.',
			decorFeatures: [
				'3 тегін шарт',
				'PDF экспорт',
				'ҚР Заңы 2026',
				'Лезде жасау'
			],
			title: 'Аккаунт жасау',
			hasAccount: 'Аккаунтыңыз бар ма?',
			loginLink: 'Кіру',
			nameLabel: 'Аты-жөні',
			namePlaceholder: 'Макишев Ерсұлтан',
			emailLabel: 'Email',
			emailPlaceholder: 'you@company.kz',
			passwordLabel: 'Құпия сөз',
			passwordHint: '(кем дегенде 8 таңба)',
			passwordPlaceholder: '••••••••',
			submit: 'Тегін бастау',
			submitting: 'Аккаунт жасалуда...',
			errorDefault: 'Тіркелу кезінде қате'
		},
		dashboard: {
			mainMenu: 'Басты мәзір',
			panel: 'Басқару тақтасы',
			myContracts: 'Менің шарттарым',
			newContract: 'Жаңа шарт',
			team: 'Команда',
			settingsGroup: 'Параметрлер',
			settings: 'Параметрлер',
			account: 'Аккаунт',
			help: 'Көмек',
			tariffStart: 'Бастаушы тарифі',
			adminRole: 'Әкімші',
			searchPlaceholder: 'Шарттарды іздеу...',
			greeting: 'Қайта оралдыңыз,',
			greetingSubtitle: 'Құжаттарыңызда болып жатқан жағдай.',
			greetingTime: {
				morning: 'Қайырлы таң,',
				afternoon: 'Қайырлы күн,',
				evening: 'Қайырлы кеш,'
			},
			allTime: 'Барлық уақыт',
			stats: {
				total: 'Барлық шарттар',
				totalSub: 'барлығы',
				draft: 'Жобалар',
				draftSub: 'толтыруды күтуде',
				generated: 'Дайын',
				generatedSub: 'PDF қол жетімді',
				statLabel: 'Статистика'
			},
			table: {
				title: 'Менің шарттарым',
				create: 'Жасау',
				loading: 'Жүктелуде...',
				emptySearch: 'Шарттар табылмады',
				empty: 'Сізде әлі шарттар жоқ',
				emptySubtitle: 'Алғашқы шартты жасаңыз — бұл бір минутқа жетпейді.',
				createFirst: 'Алғашқы шартты жасау',
				colName: 'Атауы',
				colDate: 'Күні',
				colStatus: 'Мәртебе',
				colActions: 'Әрекеттер',
				showAll: 'Барлығын көру'
			},
			quickActions: {
				createTitle: 'Шарт жасау',
				createDesc:
					'Үлгіні таңдаңыз, пішінді толтырыңыз және секундтар ішінде дайын PDF алыңыз.',
				createBtn: 'Бастау',
				templatesTitle: 'Шарт үлгілері',
				templatesDesc:
					'Қызмет, жалдау және сатып алу-сату — ҚР заңнамасына сәйкес.',
				templatesBtn: 'Таңдау',
				templateNames: ['Қызмет', 'Жалдау', 'Сату']
			}
		},
		status: {
			generated: 'Дайын',
			draft: 'Жоба',
			failed: 'Қате'
		},
		newContract: {
			back: 'Таңдауға оралу',
			backDashboard: 'Басқару тақтасы',
			pageTitle: 'Жаңа шарт',
			step1Label: 'Түр',
			step2Label: 'Деректер',
			step3Label: 'Дайын',
			selectTitle: 'Шарт түрін таңдаңыз',
			selectSubtitle: 'Барлық үлгілер ҚР заңнамасына сәйкес.',
			loadingTemplates: 'Үлгілер жүктелуде...',
			fillTitle: 'Пішінді толтырыңыз',
			fillSubtitle: 'Барлық өрістерді толтырыңыз — олар шартқа кірістіріледі.',
			titleLabel: 'Шарттың атауы',
			required: '*',
			submitBtn: 'Шарт жасау',
			submitting: 'PDF жасалуда...',
			doneTitle: 'Шарт жасалды!',
			doneSubtitle: 'PDF жүктеуге дайын.',
			openContract: 'Шартты ашу',
			toList: 'Тізімге',
			createMore: 'Тағы жасау',
			profileSelector: 'Автотолтыру профилі',
			profileSelectorPlaceholder: 'Автотолтыру үшін профильді таңдаңыз',
			fillFromProfile: 'Профильден толтыру',
			noProfiles: 'Профильдер жоқ',
			manageProfiles: 'Параметрлер',
			hintTitle: 'Уақытты үнемдеңіз',
			hintMessage:
				'Болашақ шарттарды жылдам толтыру үшін деректерді Параметрлерде сақтаңыз.',
			hintGoSettings: 'Параметрлерге өту',
			hintDismiss: 'Түсінікті'
		},
		contractDetail: {
			back: 'Артқа',
			pageTitle: 'Шарт',
			downloadPDF: 'PDF жүктеу',
			loading: 'Жүктелуде...',
			created: 'Жасалған:'
		},
		common: {
			delete: 'Жою',
			deleteConfirm: 'Шартты жою керек пе?',
			download: 'PDF жүктеу',
			language: 'Тіл',
			appName: 'Контрактум',
			appInitial: 'К'
		},
		settings: {
			pageTitle: 'Аккаунт параметрлері',
			pageSubtitle: 'Профильіңізді және қауіпсіздік параметрлерін басқарыңыз',
			profileSection: 'Профиль',
			profileDesc: 'Атыңыз бен байланыс ақпаратын жаңартыңыз',
			nameLabel: 'Толық аты-жөні',
			namePlaceholder: 'Ерсұлтан Макишев',
			emailLabel: 'Email',
			emailDisabled: 'Email өзгертуге болмайды',
			saveProfile: 'Өзгерістерді сақтау',
			savingProfile: 'Сақтауда...',
			profileSuccess: 'Профиль сәтті жаңартылды',
			securitySection: 'Қауіпсіздік',
			securityDesc: 'Құпия сөзді өзгертіңіз',
			currentPasswordLabel: 'Ағымдағы құпия сөз',
			currentPasswordPlaceholder: 'Ағымдағы құпия сөзді енгізіңіз',
			newPasswordLabel: 'Жаңа құпия сөз',
			newPasswordPlaceholder: 'Кем дегенде 8 таңба',
			changePassword: 'Құпия сөзді өзгерту',
			changingPassword: 'Өзгертуде...',
			passwordSuccess: 'Құпия сөз сәтті өзгертілді',
			profiles: {
				sectionTitle: 'Автотолтыру профильдері',
				sectionDesc: 'Шарт нысандарын жылдам толтыру үшін деректерді сақтаңыз',
				addProfile: 'Профиль қосу',
				editProfile: 'Өңдеу',
				deleteProfile: 'Жою',
				deleteConfirm: 'Профильді жою керек пе?',
				saveBtn: 'Сақтау',
				cancelBtn: 'Болдырмау',
				labelLabel: 'Профиль атауы',
				labelPlaceholder: 'Мысалы: Менің компаниям',
				typeLabel: 'Түрі',
				typeIndividual: 'Жеке тұлға',
				typeLegal: 'Заңды тұлға',
				fieldIIN: 'ЖСН',
				fieldBIN: 'БСН',
				fieldFullName: 'Аты-жөні',
				fieldCompanyName: 'Ұйым атауы',
				fieldLegalAddress: 'Заңды мекенжай',
				fieldActualAddress: 'Нақты мекенжай',
				fieldPhone: 'Телефон',
				fieldEmail: 'Email',
				fieldIBAN: 'IBAN',
				fieldBIK: 'БИК',
				noProfiles: 'Сақталған профильдер жоқ',
				individual: 'Жеке тұлға',
				legalEntity: 'Заңды тұлға',
				createSuccess: 'Профиль жасалды',
				updateSuccess: 'Профиль жаңартылды',
				deleteSuccess: 'Профиль жойылды'
			}
		},
		team: {
			pageTitle: 'Команда',
			pageSubtitle:
				'Шарттар бойынша бірлескен жұмыс жақында қол жетімді болады',
			comingSoon: 'Жақында',
			comingSoonDesc:
				'Біз команда жұмысы мүмкіндігін жасауда. Әріптестерді шақырыңыз, рөлдер тағайындаңыз және бірге құжаттарды келісіңіз.',
			feature1Title: 'Қатысушыларды шақыру',
			feature1Desc:
				'Әріптестерді қосыңыз және рөлдер тағайындаңыз: қарау, өңдеу немесе басқару.',
			feature2Title: 'Бірлескен өңдеу',
			feature2Desc:
				'Пікірлер қалдыру мүмкіндігімен шарттарды бір уақытта өңдеңіз.',
			feature3Title: 'Құжаттарды келісу',
			feature3Desc:
				'Келісу тізбегін орнатыңыз және бекіту мәртебесін бақылаңыз.',
			notifyBtn: 'Хабарлаңыз',
			notifyPlaceholder: 'Сіздің email',
			notifySuccess: 'Сіз бірінші боласыз!'
		},
		help: {
			pageTitle: 'Көмек және қолдау',
			pageSubtitle: 'Жиі қойылатын сұрақтарға жауап табыңыз',
			searchPlaceholder: 'Сұрақтарды іздеу...',
			faqTitle: 'Жиі қойылатын сұрақтар',
			contactTitle: 'Қолдаумен байланысу',
			contactDesc:
				'Жауап таппадыңыз ба? Бізге жазыңыз — 24 сағат ішінде жауап береміз.',
			contactBtn: 'Қолдауға жазу',
			contactEmail: 'support@contractum.kz',
			docsTitle: 'Құжаттама',
			docsDesc: 'Платформаны пайдалану бойынша егжей-тегжейлі нұсқаулықтар.',
			docsBtn: 'Құжаттаманы ашу',
			faqItems: [
				{
					q: 'Алғашқы шартты қалай жасауға болады?',
					a: 'Басқару тақтасындағы «Жаңа шарт» түймесін басып, үлгі түрін таңдаңыз, пішінді толтырыңыз және дайын PDF алыңыз.'
				},
				{
					q: 'Жасалған шартты өңдеуге болады ма?',
					a: 'Иә. Шартты ашып, «Өңдеу» түймесін басыңыз. Сақтаған соң PDF қайта жасалады.'
				},
				{
					q: 'PDF-ті қалай жүктеуге болады?',
					a: 'Шарт бетінде немесе басқару тақтасының кестесінде жүктеу белгішесін басыңыз.'
				},
				{
					q: 'Шарттар ҚР заңнамасына сәйкес пе?',
					a: 'Иә. Барлық үлгілер Қазақстан Республикасының қолданыстағы азаматтық және еңбек заңнамасын ескере отырып әзірленген.'
				},
				{
					q: 'Құпия сөзді қалай өзгертуге болады?',
					a: '«Параметрлер» → «Қауіпсіздік» бөліміне өтіп, ағымдағы және жаңа құпия сөзді енгізіңіз.'
				},
				{
					q: 'Шартты жоюға болады ма?',
					a: 'Иә. Шарттар кестесінде себет белгішесін басыңыз. Жою қайтарылмайды.'
				}
			]
		},
		contracts: {
			pageTitle: 'Менің шарттарым',
			pageSubtitle: 'Барлық шарттарыңыз бір жерде',
			newContract: 'Жаңа шарт'
		},
		admin: {
			pageTitle: 'Әкімші тақтасы',
			tabUsers: 'Пайдаланушылар',
			tabContracts: 'Барлық шарттар',
			tabTemplates: 'Үлгілер',
			tabFunnel: 'Воронка',
			accessDenied: 'Қол жеткізу тыйым салынды',
			usersTitle: 'Пайдаланушылар',
			colEmail: 'Email',
			colName: 'Аты-жөні',
			colRole: 'Рөл',
			colStatus: 'Мәртебе',
			colJoined: 'Тіркелген күні',
			roleAdmin: 'Әкімші',
			roleUser: 'Пайдаланушы',
			statusActive: 'Белсенді',
			statusInactive: 'Белсенді емес',
			contractsTitle: 'Барлық шарттар',
			filterByStatus: 'Барлық мәртебелер',
			colTitle: 'Атауы',
			colUser: 'Пайдаланушы',
			colTemplate: 'Үлгі',
			colDate: 'Күні',
			colActions: 'Әрекеттер',
			downloadPDF: 'PDF жүктеу',
			prevPage: 'Артқа',
			nextPage: 'Алға',
			pageOf: 'Бет',
			of: '/',
			templatesTitle: 'Үлгілер',
			createTemplate: 'Үлгі жасау',
			colType: 'Түрі',
			colNameRu: 'Атауы (орысша)',
			colVersion: 'Нұсқа',
			colActive: 'Белсенді',
			editTemplate: 'Өңдеу',
			deleteTemplate: 'Жою',
			deleteConfirmTitle: 'Үлгіні жою керек пе?',
			deleteConfirmMessage: 'Бұл әрекет қайтарылмайды. Үлгі мәңгіге жойылады.',
			confirmDelete: 'Жою',
			confirmCancel: 'Болдырмау',
			deleteSuccess: 'Үлгі жойылды',
			deleteError: 'Үлгіні жоюға болмады',
			toggleSuccess: 'Үлгі мәртебесі жаңартылды',
			toggleError: 'Мәртебені жаңартуға болмады',
			editorCreateTitle: 'Үлгі жасау',
			editorEditTitle: 'Үлгіні өңдеу',
			fieldType: 'Түр (идентификатор)',
			fieldTypePlaceholder: 'service, lease, sale...',
			fieldNameRu: 'Атауы (орысша)',
			fieldNameRuPlaceholder: 'Қызмет шарты',
			fieldNameKz: 'Атауы (қазақша)',
			fieldNameKzPlaceholder: 'Қызмет шарты',
			fieldHtmlBody: 'HTML-үлгі',
			fieldHtmlBodyPlaceholder:
				'<html>...</html>  {{.FieldName}} өрістері үшін',
			fieldSchema: 'Өріс схемасы (JSON)',
			fieldSchemaPlaceholder:
				'{"fields":[{"name":"ClientName","label":"Клиент аты","type":"text","required":true}]}',
			previewTitle: 'Алдын ала қарау',
			saveBtn: 'Сақтау',
			saving: 'Сақтауда...',
			cancelBtn: 'Болдырмау',
			schemaParseError: 'JSON схемасын талдау қатесі',
			createSuccess: 'Үлгі жасалды',
			updateSuccess: 'Үлгі жаңартылды',
			saveError: 'Үлгіні сақтауға болмады',
			loading: 'Жүктелуде...'
		},
		toast: {
			success: 'Сәтті',
			error: 'Қате',
			warning: 'Ескерту',
			info: 'Ақпарат',
			deleteConfirmTitle: 'Шартты жою керек пе?',
			deleteConfirmMessage:
				'Бұл әрекетті болдырмауға болмайды. Шарт мәңгіге жойылады.',
			confirmCancel: 'Болдырмау',
			confirmDelete: 'Жою',
			deleteSuccess: 'Шарт жойылды',
			deleteSuccessDesc: 'Шарт сәтті жойылды',
			deleteError: 'Жою қатесі',
			deleteErrorDesc: 'Шартты жоюға болмады',
			contractCreated: 'Шарт жасалды',
			contractCreatedDesc: 'PDF жүктеуге дайын',
			contractCreateError: 'Жасау қатесі',
			profileError: 'Профильді жаңартуға болмады',
			passwordError: 'Құпия сөзді өзгертуге болмады',
			loginError: 'Кіру орындалмады',
			loginSuccess: 'Кіру орындалды',
			loginSuccessDesc: 'Жүйеге қош келдіңіз',
			registerError: 'Тіркелу орындалмады',
			registerSuccess: 'Аккаунт жасалды',
			registerSuccessDesc: 'Контрактумға қош келдіңіз',
			pdfDownloadSuccess: 'PDF жүктелді',
			pdfDownloadError: 'PDF жүктеуге болмады'
		},
		aiAnalysis: {
			title: 'Интеллектуалды талдау',
			btnAnalyze: 'ЖИ-мен талдау',
			analyzing: 'Талдауда...',
			riskLevel: 'Қауіп деңгейі',
			healthScore: 'Денсаулық бағасы',
			summary: 'Жалпы қорытынды',
			issues: 'Анықталған қауіптер',
			recommendations: 'Ұсыныстар',
			noIssues: 'Қауіптер табылмады',
			riskLevels: {
				low: 'Төмен',
				medium: 'Орташа',
				high: 'Жоғары',
				critical: 'Күрделі',
				unknown: 'Белгісіз'
			},
			categories: {
				missing_clause: 'Жоқ тармақ',
				ambiguous_term: 'Бұлыңғыр тұжырым',
				illegal_term: 'Заңсыз шарт',
				one_sided: 'Біржақты мүдде',
				missing_details: 'Мәліметтер жеткіліксіз',
				compliance: 'Комплаенс'
			},
			steps: {
				reading: 'Шартты оқып жатырмын...',
				checkingNorms: 'ҚР нормаларын тексеріп жатырмын...',
				identifyingRisks: 'Қауіптерді анықтап жатырмын...',
				generatingReport: 'Есеп жасап жатырмын...'
			},
			error: 'Талдауды орындау мүмкін болмады',
			retry: 'Талдауды қайталау'
		}
	},

	// ─────────────────────────────────────────────────────────────────────────────
	// ENGLISH
	// ─────────────────────────────────────────────────────────────────────────────
	en: {
		nav: {
			features: 'Features',
			howItWorks: 'How It Works',
			cases: 'Use Cases',
			pricing: 'Pricing',
			login: 'Sign In',
			cta: 'Get Started Free'
		},
		hero: {
			badge: 'Legal AI adapted for Kazakhstan law',
			title1: 'Create contracts',
			title2: 'powered by intelligence',
			subtitle:
				'Generate legally flawless documents instantly. Save time and legal fees without risking your business security.',
			createContract: 'Create Contract',
			watchDemo: 'Watch Demo',
			trustedBy: 'Trusted by:'
		},
		trust: {
			title: 'Trusted by Kazakhstan market leaders',
			subtitle:
				'0 companies have already automated their legal work with Contractum.'
		},
		features: {
			sectionTitle: 'Everything you need for modern legal work',
			sectionSubtitle:
				"We've combined cutting-edge AI with a deep understanding of local law so you can focus on growing your business.",
			allFeatures: 'All features',
			items: [
				{
					title: 'AI-Powered Generator',
					description:
						'Our AI understands your business context and creates precise legal language in seconds.'
				},
				{
					title: 'Kazakhstan Legislation',
					description:
						'Every document is verified for compliance with the current codes and laws of the Republic of Kazakhstan.'
				},
				{
					title: 'Multilingual',
					description:
						'Contracts in Kazakh, Russian, and English with perfect legal terminology.'
				},
				{
					title: 'Team Collaboration',
					description:
						'Invite colleagues to co-edit and approve documents together.'
				},
				{
					title: 'Secure Cloud',
					description:
						'Your data is encrypted and stored on protected servers with multi-level access control.'
				}
			]
		},
		preview: {
			label: 'Interface',
			title: 'Professional workspace',
			subtitle:
				'Manage your entire legal cycle in one place. From generation to signing and storage — Contractum offers a clean, intuitive interface built for business efficiency.',
			points: [
				'Auto-fill forms based on company data',
				'Real-time AI legal suggestions',
				'Version control and change history'
				// 'Integrated e-signature support'
			],
			cta: 'Try the workspace',
			aiTag: 'AI Recommendation',
			aiText:
				'"Clause 4.2 should be supplemented with a force majeure provision for better protection of the parties\' interests."'
		},
		heroInteractive: {
			title: 'New service agreement',
			subtitle: 'Fill in the fields — AI will check everything',
			progress: 'Progress',
			fields: [
				{ label: 'Client', value: 'Almaty Stroy LLC' },
				{ label: 'Contract amount', value: '2 500 000 ₸' },
				{ label: 'Deadline', value: '31.12.2026' }
			],
			aiCheck: 'AI is checking compliance with Civil Code RK 2026...',
			generateBtn: 'Generate PDF',
			notifTitle: 'PDF ready!',
			notifFile: 'Contract_001.pdf · 48 KB'
		},
		dashboardInteractive: {
			windowTitle: 'Contractum · My contracts',
			statContracts: 'Contracts',
			statAvgTime: 'Avg. time',
			statCompliance: 'RK compliance',
			contracts: [
				{ name: 'Lease agreement #4', date: '05.03.2026' },
				{ name: 'Service contract #12', date: '04.03.2026' },
				{ name: 'Purchase agreement #7', date: '06.03.2026' }
			],
			statusDone: 'Done',
			statusLive: 'Creating...',
			lastUpdated: 'Last updated: just now',
			createNew: 'Create new'
		},
		animatedMetric: {
			avgTime: 'average creation time',
			bars: [
				{ label: 'Service contract', w: 95 },
				{ label: 'Lease', w: 88 },
				{ label: 'Purchase', w: 80 }
			]
		},
		howItWorks: {
			label: 'Process',
			title1: 'From idea to contract',
			title2: 'in 3 simple steps',
			subtitle:
				"We've turned a complex legal process into an intuitive digital experience.",
			cta: 'Start now',
			users: '+0',
			steps: [
				{
					number: '01',
					title: 'Choose contract type',
					description:
						'Use the library of 100+ templates or describe the task to the AI in your own words.'
				},
				{
					number: '02',
					title: 'Answer AI questions',
					description:
						'The assistant will clarify the deal details so the document fully protects your interests.'
				},
				{
					number: '03',
					title: 'Get your document',
					description:
						'Download your legally valid contract as PDF or Word in seconds.'
				}
			]
		},
		useCases: {
			title: 'Built for every stage of business',
			subtitle:
				'Contractum scales with you — from your first contract to enterprise governance.',
			items: [
				{
					title: 'Startups',
					desc: 'Incorporation agreements, IP transfer, options and NDAs for investors.'
				},
				{
					title: 'Small Business',
					desc: 'Employment contracts, office leases, and supplier agreements.'
				},
				{
					title: 'Freelancers',
					desc: 'Service agreements, payment protection, and copyright protection.'
				},
				{
					title: 'Enterprises',
					desc: 'Compliance audits, bulk contract generation, and API access.'
				}
			]
		},
		pricing: {
			title: 'Simple, transparent pricing',
			subtitle: 'Choose the plan that fits your business.',
			popular: 'Most popular',
			perMonth: '/mo',
			tiers: [
				{
					name: 'Starter',
					price: '0',
					description: 'For freelancers and sole proprietors.',
					features: [
						'3 contracts/month',
						'Standard templates',
						'PDF export',
						'Basic support'
					],
					cta: 'Get started free',
					popular: false
				},
				{
					name: 'Pro',
					price: '15,000',
					description: 'For growing startups and small businesses.',
					features: [
						'Unlimited contracts',
						'Custom AI generation',
						'Team (up to 5)',
						'Word & PDF export',
						'Priority support'
					],
					cta: 'Try free',
					popular: true
				},
				{
					name: 'Business',
					price: 'Custom',
					description: 'For large companies and legal departments.',
					features: [
						'All Pro features',
						'API access',
						'AI trained on your data',
						'Dedicated manager',
						'SSO & advanced security'
					],
					cta: 'Contact us',
					popular: false
				}
			]
		},
		cta: {
			title1: 'Create secure contracts',
			title2: 'starting today',
			subtitle:
				'Join 0 companies in Kazakhstan that have automated their legal work. Start for free right now.',
			primary: 'Get started free',
			secondary: 'Contact sales',
			badge1: 'Compliant with RK Civil Code',
			badge2: 'Data encryption',
			badge3: '24/7 support'
		},
		footer: {
			tagline:
				'Growing business in Kazakhstan with AI-powered legal solutions. Fast, secure, lawful.',
			product: 'Product',
			company: 'Company',
			newsletter: 'Newsletter',
			newsletterText: 'Get updates on RK legislation and new features.',
			emailPlaceholder: 'Email',
			copyright: '© 2026 Contractum. All rights reserved. Made in Kazakhstan.',
			secureConnection: 'Secure connection',
			productLinks: ['Features', 'Templates', 'AI Assistant', 'Pricing'],
			companyLinks: ['About', 'Careers', 'Blog', 'Contact']
		},
		login: {
			decorTitle: 'Next-generation legal documents',
			decorSubtitle:
				'Create contracts compliant with Kazakhstan law in minutes using AI.',
			decorUsers: '0 companies already with us',
			title: 'Welcome back',
			noAccount: "Don't have an account?",
			registerLink: 'Sign up',
			emailLabel: 'Email',
			emailPlaceholder: 'you@company.kz',
			passwordLabel: 'Password',
			passwordPlaceholder: '••••••••',
			submit: 'Sign In',
			submitting: 'Signing in...',
			errorDefault: 'Invalid email or password'
		},
		register: {
			decorTitle: 'Start creating contracts for free',
			decorSubtitle:
				'3 contracts a month, no restrictions. No cards, no hidden fees.',
			decorFeatures: [
				'3 free contracts',
				'PDF export',
				'RK Law 2026',
				'Instant generation'
			],
			title: 'Create account',
			hasAccount: 'Already have an account?',
			loginLink: 'Sign in',
			nameLabel: 'Full name',
			namePlaceholder: 'Yersultan Makishev',
			emailLabel: 'Email',
			emailPlaceholder: 'you@company.kz',
			passwordLabel: 'Password',
			passwordHint: '(min. 8 characters)',
			passwordPlaceholder: '••••••••',
			submit: 'Get started free',
			submitting: 'Creating account...',
			errorDefault: 'Registration error'
		},
		dashboard: {
			mainMenu: 'Main menu',
			panel: 'Dashboard',
			myContracts: 'My Contracts',
			newContract: 'New Contract',
			team: 'Team',
			settingsGroup: 'Settings',
			settings: 'Settings',
			account: 'Account',
			help: 'Help',
			tariffStart: 'Starter plan',
			adminRole: 'Administrator',
			searchPlaceholder: 'Search contracts...',
			greeting: 'Welcome back,',
			greetingSubtitle: "Here's what's happening with your documents.",
			greetingTime: {
				morning: 'Good morning,',
				afternoon: 'Good afternoon,',
				evening: 'Good evening,'
			},
			allTime: 'All time',
			stats: {
				total: 'All contracts',
				totalSub: 'total',
				draft: 'Drafts',
				draftSub: 'pending fill',
				generated: 'Ready',
				generatedSub: 'PDF available',
				statLabel: 'Stats'
			},
			table: {
				title: 'My contracts',
				create: 'Create',
				loading: 'Loading...',
				emptySearch: 'No contracts found',
				empty: 'You have no contracts yet',
				emptySubtitle: 'Create your first contract — it takes less than a minute.',
				createFirst: 'Create first contract',
				colName: 'Name',
				colDate: 'Date',
				colStatus: 'Status',
				colActions: 'Actions',
				showAll: 'Show all'
			},
			quickActions: {
				createTitle: 'Create a contract',
				createDesc:
					'Choose a template, fill the form, and get a ready PDF in seconds.',
				createBtn: 'Start',
				templatesTitle: 'Contract templates',
				templatesDesc:
					'Services, rental, and sale — compliant with Kazakhstan law.',
				templatesBtn: 'Browse',
				templateNames: ['Services', 'Rental', 'Sale']
			}
		},
		status: {
			generated: 'Ready',
			draft: 'Draft',
			failed: 'Failed'
		},
		newContract: {
			back: 'Back to selection',
			backDashboard: 'Dashboard',
			pageTitle: 'New Contract',
			step1Label: 'Type',
			step2Label: 'Details',
			step3Label: 'Done',
			selectTitle: 'Choose contract type',
			selectSubtitle: 'All templates comply with Kazakhstan legislation.',
			loadingTemplates: 'Loading templates...',
			fillTitle: 'Fill in the details',
			fillSubtitle:
				'Fill in all fields — they will be inserted into the contract.',
			titleLabel: 'Contract title',
			required: '*',
			submitBtn: 'Create contract',
			submitting: 'Generating PDF...',
			doneTitle: 'Contract created!',
			doneSubtitle: 'PDF is ready for download.',
			openContract: 'Open contract',
			toList: 'To list',
			createMore: 'Create another',
			profileSelector: 'Smart fill profile',
			profileSelectorPlaceholder: 'Select a profile to auto-fill',
			fillFromProfile: 'Fill from profile',
			noProfiles: 'No profiles',
			manageProfiles: 'Settings',
			hintTitle: 'Save time',
			hintMessage:
				'Save your details in Settings to quickly fill future contracts.',
			hintGoSettings: 'Go to Settings',
			hintDismiss: 'Got it'
		},
		contractDetail: {
			back: 'Back',
			pageTitle: 'Contract',
			downloadPDF: 'Download PDF',
			loading: 'Loading...',
			created: 'Created:'
		},
		common: {
			delete: 'Delete',
			deleteConfirm: 'Delete this contract?',
			download: 'Download PDF',
			language: 'Language',
			appName: 'Contractum',
			appInitial: 'C'
		},
		settings: {
			pageTitle: 'Account Settings',
			pageSubtitle: 'Manage your profile and security preferences',
			profileSection: 'Profile',
			profileDesc: 'Update your name and contact information',
			nameLabel: 'Full name',
			namePlaceholder: 'Yersultan Makishev',
			emailLabel: 'Email',
			emailDisabled: 'Email cannot be changed',
			saveProfile: 'Save changes',
			savingProfile: 'Saving...',
			profileSuccess: 'Profile updated successfully',
			securitySection: 'Security',
			securityDesc: 'Change your password',
			currentPasswordLabel: 'Current password',
			currentPasswordPlaceholder: 'Enter current password',
			newPasswordLabel: 'New password',
			newPasswordPlaceholder: 'Minimum 8 characters',
			changePassword: 'Change password',
			changingPassword: 'Changing...',
			passwordSuccess: 'Password changed successfully',
			profiles: {
				sectionTitle: 'Smart Fill Profiles',
				sectionDesc: 'Save your details to quickly fill contract forms',
				addProfile: 'Add profile',
				editProfile: 'Edit',
				deleteProfile: 'Delete',
				deleteConfirm: 'Delete this profile?',
				saveBtn: 'Save',
				cancelBtn: 'Cancel',
				labelLabel: 'Profile name',
				labelPlaceholder: 'E.g. My Company',
				typeLabel: 'Type',
				typeIndividual: 'Individual',
				typeLegal: 'Legal entity',
				fieldIIN: 'IIN',
				fieldBIN: 'BIN',
				fieldFullName: 'Full name',
				fieldCompanyName: 'Company name',
				fieldLegalAddress: 'Legal address',
				fieldActualAddress: 'Actual address',
				fieldPhone: 'Phone',
				fieldEmail: 'Email',
				fieldIBAN: 'IBAN',
				fieldBIK: 'BIK',
				noProfiles: 'No saved profiles',
				individual: 'Individual',
				legalEntity: 'Legal entity',
				createSuccess: 'Profile created',
				updateSuccess: 'Profile updated',
				deleteSuccess: 'Profile deleted'
			}
		},
		team: {
			pageTitle: 'Team',
			pageSubtitle: 'Collaborative contract work is coming soon',
			comingSoon: 'Coming soon',
			comingSoonDesc:
				'We are building team collaboration features. Invite colleagues, assign roles, and approve documents together.',
			feature1Title: 'Invite members',
			feature1Desc:
				'Add colleagues and assign roles: viewer, editor, or admin.',
			feature2Title: 'Collaborative editing',
			feature2Desc: 'Work on contracts simultaneously with inline comments.',
			feature3Title: 'Document approval',
			feature3Desc: 'Set up an approval chain and track sign-off status.',
			notifyBtn: 'Notify me',
			notifyPlaceholder: 'Your email',
			notifySuccess: "You'll be the first to know!"
		},
		help: {
			pageTitle: 'Help & Support',
			pageSubtitle: 'Find answers to frequently asked questions',
			searchPlaceholder: 'Search questions...',
			faqTitle: 'Frequently Asked Questions',
			contactTitle: 'Contact Support',
			contactDesc:
				"Didn't find an answer? Write to us — we'll respond within 24 hours.",
			contactBtn: 'Contact support',
			contactEmail: 'support@contractum.kz',
			docsTitle: 'Documentation',
			docsDesc: 'Detailed guides on using the platform.',
			docsBtn: 'Open documentation',
			faqItems: [
				{
					q: 'How do I create my first contract?',
					a: 'Click "New Contract" on the dashboard, choose a template type, fill in the form, and get your ready PDF.'
				},
				{
					q: 'Can I edit an existing contract?',
					a: 'Yes. Open the contract and click "Edit". After saving, the PDF will be regenerated.'
				},
				{
					q: 'How do I download a PDF?',
					a: 'On the contract page or in the dashboard table, click the download icon.'
				},
				{
					q: 'Are contracts compliant with Kazakhstan law?',
					a: 'Yes. All templates are developed in accordance with the current civil and labor legislation of the Republic of Kazakhstan.'
				},
				{
					q: 'How do I change my password?',
					a: 'Go to Settings → Security section, enter your current and new password.'
				},
				{
					q: 'Can I delete a contract?',
					a: 'Yes. In the contracts table, click the trash icon. Deletion is irreversible.'
				}
			]
		},
		contracts: {
			pageTitle: 'My Contracts',
			pageSubtitle: 'All your contracts in one place',
			newContract: 'New Contract'
		},
		admin: {
			pageTitle: 'Admin Panel',
			tabUsers: 'Users',
			tabContracts: 'All Contracts',
			tabTemplates: 'Templates',
			tabFunnel: 'Funnel',
			accessDenied: 'Access denied',
			usersTitle: 'Users',
			colEmail: 'Email',
			colName: 'Name',
			colRole: 'Role',
			colStatus: 'Status',
			colJoined: 'Joined',
			roleAdmin: 'Admin',
			roleUser: 'User',
			statusActive: 'Active',
			statusInactive: 'Inactive',
			contractsTitle: 'All Contracts',
			filterByStatus: 'All statuses',
			colTitle: 'Title',
			colUser: 'User',
			colTemplate: 'Template',
			colDate: 'Date',
			colActions: 'Actions',
			downloadPDF: 'Download PDF',
			prevPage: 'Previous',
			nextPage: 'Next',
			pageOf: 'Page',
			of: 'of',
			templatesTitle: 'Templates',
			createTemplate: 'Create Template',
			colType: 'Type',
			colNameRu: 'Name (RU)',
			colVersion: 'Version',
			colActive: 'Active',
			editTemplate: 'Edit',
			deleteTemplate: 'Delete',
			deleteConfirmTitle: 'Delete template?',
			deleteConfirmMessage:
				'This action cannot be undone. The template will be permanently deleted.',
			confirmDelete: 'Delete',
			confirmCancel: 'Cancel',
			deleteSuccess: 'Template deleted',
			deleteError: 'Failed to delete template',
			toggleSuccess: 'Template status updated',
			toggleError: 'Failed to update status',
			editorCreateTitle: 'Create Template',
			editorEditTitle: 'Edit Template',
			fieldType: 'Type (identifier)',
			fieldTypePlaceholder: 'service, lease, sale...',
			fieldNameRu: 'Name (Russian)',
			fieldNameRuPlaceholder: 'Service Agreement',
			fieldNameKz: 'Name (Kazakh)',
			fieldNameKzPlaceholder: 'Қызмет шарты',
			fieldHtmlBody: 'HTML Template',
			fieldHtmlBodyPlaceholder:
				'<html>...</html>  Use {{.FieldName}} for fields',
			fieldSchema: 'Fields Schema (JSON)',
			fieldSchemaPlaceholder:
				'{"fields":[{"name":"ClientName","label":"Client Name","type":"text","required":true}]}',
			previewTitle: 'Preview',
			saveBtn: 'Save',
			saving: 'Saving...',
			cancelBtn: 'Cancel',
			schemaParseError: 'JSON schema parse error',
			createSuccess: 'Template created',
			updateSuccess: 'Template updated',
			saveError: 'Failed to save template',
			loading: 'Loading...'
		},
		toast: {
			success: 'Success',
			error: 'Error',
			warning: 'Warning',
			info: 'Info',
			deleteConfirmTitle: 'Delete contract?',
			deleteConfirmMessage:
				'This action cannot be undone. The contract will be permanently deleted.',
			confirmCancel: 'Cancel',
			confirmDelete: 'Delete',
			deleteSuccess: 'Contract deleted',
			deleteSuccessDesc: 'Contract was successfully deleted',
			deleteError: 'Delete error',
			deleteErrorDesc: 'Failed to delete contract',
			contractCreated: 'Contract created',
			contractCreatedDesc: 'PDF is ready for download',
			contractCreateError: 'Creation error',
			profileError: 'Failed to update profile',
			passwordError: 'Failed to change password',
			loginError: 'Login failed',
			loginSuccess: 'Logged in',
			loginSuccessDesc: 'Welcome to the system',
			registerError: 'Registration failed',
			registerSuccess: 'Account created',
			registerSuccessDesc: 'Welcome to Contractum',
			pdfDownloadSuccess: 'PDF downloaded',
			pdfDownloadError: 'Failed to download PDF'
		},
		aiAnalysis: {
			title: 'AI Analysis',
			btnAnalyze: 'Analyze with AI',
			analyzing: 'Analyzing...',
			riskLevel: 'Risk Level',
			healthScore: 'Health Score',
			summary: 'Summary',
			issues: 'Identified Risks',
			recommendations: 'Recommendations',
			noIssues: 'No risks found',
			riskLevels: {
				low: 'Low',
				medium: 'Medium',
				high: 'High',
				critical: 'Critical',
				unknown: 'Unknown'
			},
			categories: {
				missing_clause: 'Missing Clause',
				ambiguous_term: 'Ambiguous Term',
				illegal_term: 'Illegal Term',
				one_sided: 'One-sided Interest',
				missing_details: 'Missing Details',
				compliance: 'Compliance'
			},
			steps: {
				reading: 'Reading contract...',
				checkingNorms: 'Checking RK norms...',
				identifyingRisks: 'Identifying risks...',
				generatingReport: 'Generating report...'
			},
			error: 'Analysis failed',
			retry: 'Retry analysis'
		}
	}
} as const

export type Translations = typeof translations.ru
export default translations