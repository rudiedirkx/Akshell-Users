// The main code file of your application

// The setup of the basic Akshell library
require('ak').setup();


// Init
db = rv;
initdb = function() {
  db.User.create({
    user_id: 'unique serial',
    name: 'string',
    full_name: 'string',
    email: 'string'
  });
};


// Actions
var IndexHandler = Handler.subclass({
  get: function (request) {
    return render('index.html', {
      header: 'Ola!?'
    });
  }
});

var UserHandler = Handler.subclass({
  get: function(request, page) {
    var per_page = 2
    if ( 'all' === page ) {
      per_page = 99999
      page = 1
    }
    else {
      page || (page = 1)
    }

    var num_users = db.User.where('1').count();
    var pages = Math.ceil(num_users / per_page);

    return render('users.html', {
      page: page,
      pages: pages,
      users: db.User.all().get({start: per_page * (page-1), length: per_page, by: 'name'})
    });
  }
});

var AddUserHandler = Handler.subclass({
  get: function(request, email) {
    email || (email = '');
    return render('adduser.html', {
      email: email
    });
  },
  post: function(request) {
    db.User.insert(request.post);
    return redirect('/users');
  }
});


// Router
exports.root = new URLMap(IndexHandler,
  ['users/', UserHandler,
    ['add/', AddUserHandler,
      [/([^/]+)/, AddUserHandler]
    ],
    [/(all)/, UserHandler],
    [/page\/(\d+)/, UserHandler]
]
);
