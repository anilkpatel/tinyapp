Routes:

  GET /register endpoint for Registration Page 

  GET / (Home: shows if logged out) (Home: shows the if logged in)
    
  GET /login (will show a form to login with Email (type=email, name=email) and Password (use type=password  and name =password ) rod)
  
  POST /login (will authenticate the form information and POST to /register)
  
  POST /logout (will logout and return user to Home page)


  <body>
		<section>
			<h1>Login</h1>
			<% if(isLoggedIn){ %>
				<h2>username is logged in.</h2>
				<% } else { %>
					<h2>username is logged out</h2>
					<% } %>
		</section>
		<section>
			<% if(isLoggedIn){ %>
				<h2>Hi <%= userObj.name %>
				</h2>
				<form action="/logout" method="POST">
					<button type="submit">LOGOUT</button>
				</form>
				<% } else { %>
					<h2>Please <a href="/login">login</a> to your account</h2>
					<% } %>
						<h3>
							<%= date %>
						</h3>
		</section>
	</body>
	</html>
