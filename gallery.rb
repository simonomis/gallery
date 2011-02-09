
require 'sinatra'
require 'haml'
require 'sass'

get '/' do
  @title = "Yes"
  haml :index
end

get '/album' do
  @title = "Album"
  haml :album
end

get '/gallery.css' do
  scss :gallery
end
