def push_and_test
#    `make combined`
  puts "\nPushing to couchapp\n\n"
  `git describe --tags > version`
  `couchapp push`
#  `pkill cucumber`
#  sleep(2)
#  puts "starting cuke"
#  cuke_result = `cucumber`
#  puts cuke_result
#  `notify-send "Cucumber fail" -i /usr/share/icons/Humanity/status/128/dialog-warning.svg &` if cuke_result.match(/fail/i)

end

push_and_test()

watch( '.html$') {|match_data|
  puts "HTML file changed: #{match_data[0]}"
  push_and_test()
}
watch( '.js$') {|match_data|
  puts "JavaScript file changed: #{match_data[0]}"
  push_and_test()
}
watch( '.*\.json$') {|match_data|
  puts "JSON file changed: #{match_data}"
  push_and_test()
}
watch( '(.*\.coffee$)' ) {|match_data|
  puts "\nCompiling: #{match_data[0]}"
  result = `coffee --bare --compile #{match_data[0]} 2>&1`
  error = false
  puts result 
  if not error
    push_and_test()
  end
}

