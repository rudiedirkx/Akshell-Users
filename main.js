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
    page || (page = 1);

    var num_users = db.User.where('1').count();
    var pages = Math.ceil(num_users / 2);

    return render('users.html', {
      page: page,
      pages: pages,
      users: db.User.all().get({start: 2 * (page-1), length: 2, by: 'name'})
    });
  }
});

var UserAddHandler = Handler.subclass({
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
    ['add/', UserAddHandler,
      [/([^/]+)/, UserAddHandler]
    ],
    [/page\/(\d+)/, UserHandler]
  ]
);
