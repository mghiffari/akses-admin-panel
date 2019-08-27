export const constants = {
    appName: 'Akses',
    tinyMceSettings: {
        inline: false,
        statusbar: false,
        browser_spellcheck: true,
        height: 320,
        plugins: ["lists", "table"],
        toolbar:
            "undo redo | formatselect | fontsizeselect | bold italic | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table",
        menu: {
            file: { title: 'File', items: 'newdocument' },
            edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall' },
            insert: { title: 'Insert', items: 'inserttable' },
            view: { title: 'View', items: 'visualaid' },
            format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontsize align | removeformat' },
            table: { title: 'Table', items: 'inserttable tableprops deletetable row column cell' }
        }
    },
    paginatorProps: {
        pageSizeOptions: [10, 25, 50, 100],
        pageSize: 10,
        showFirstLastButtons: true,
        length: 0,
        pageIndex: 0
    },
    branchCSVFileExampleUrl: 'http://adira-akses-dev.oss-ap-southeast-5.aliyuncs.com/branch/branch_2019040811570583.csv',
    productScreen: {
        productName: '@dr_ymh_lndmrk_kslns'
    },
    articleTypePromo: 'Promo',
    notificationLinkType: {
        article: 'article',
        specialOffer: 'specialoffer',
        specialOfferLinkCategory: {
            durable: 'specialoffer_durable',
            oneclick: 'specialoffer_oneclick'
        }
    },
    specialOfferCategory: {
        oneclick: 'one click',
        durable: 'durable'
    },
    transactionType: {
        topUp: 'TO',
        payment: 'PM',
        withdrawal: 'WT'
    },
    features: {
        banner: 'homebanner',
        article: 'artikel',
        specialOffer: 'specialoffer',
        oneClickNMCY: 'oneclicknmcy',
        durableSpecialOffer: 'durablespecialoffer',
        faq: 'faq',
        branchLocation: 'lokasicabang',
        changePhoneNumber: 'ubahnomorhandphone',
        creditSimulation: 'simulasikredit',
        paymentInstruction: 'instruksipembayaran',
        notification: 'notifikasi',
        user: 'user',
        role: 'role',
        transactionReport: 'laporantransaksi',
        balanceReport: 'laporansaldo',
        gamificationRule: 'gamificationrule',
        cashbackReward: 'cashbackreward',
    },
    approvalStatus: {
        approved: "1",
        rejected: "0",
        waitingForApproval: "2"
    },
    approvalType: {
        specialOffer: "specialoffer"
    },
    gamification: {
        upcoming: {
            status: false,
            cycleNum: 'game_cycle_num_draft',
            timestamp: 'game_timestamp_draft'
        },
        active: {
            status: true,
            cycleNum: 'game_cycle_num',
            timestamp:'game_timestamp_release'
        }
    }
}